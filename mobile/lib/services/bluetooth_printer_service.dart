import 'dart:convert';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../models/receipt.dart';
import 'package:intl/intl.dart';

class BluetoothPrinterService {
  BluetoothDevice? _device;
  BluetoothCharacteristic? _characteristic;

  // Generic thermal printer service/char UUIDs
  static const String serviceUuid = '000018f0-0000-1000-8000-00805f9b34fb';
  static const String charUuid = '00002af1-0000-1000-8000-00805f9b34fb';

  Future<List<BluetoothDevice>> scanDevices() async {
    await FlutterBluePlus.startScan(timeout: const Duration(seconds: 4));
    final results = await FlutterBluePlus.scanResults.first;
    return results.map((r) => r.device).toList();
  }

  Future<bool> connect(BluetoothDevice device) async {
    try {
      await device.connect();
      final services = await device.discoverServices();
      for (var service in services) {
        // Many 58mm printers use 18f0/2af1 or 18f1/2af1
        if (service.uuid.toString().contains('18f')) {
          for (var char in service.characteristics) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              _device = device;
              _characteristic = char;
              return true;
            }
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> printReceipt(ReceiptModel receipt) async {
    if (_characteristic == null) throw Exception('Yazıcı bağlı değil');

    final bytes = _generateReceiptBytes(receipt);
    
    // Chunked printing (20 bytes per chunk is safe for most BLE modules)
    const int chunkSize = 20;
    for (var i = 0; i < bytes.length; i += chunkSize) {
      final end = (i + chunkSize < bytes.length) ? i + chunkSize : bytes.length;
      await _characteristic!.write(bytes.sublist(i, end), withoutResponse: true);
      // Small delay to prevent buffer overflow on cheap printers
      await Future.delayed(const Duration(milliseconds: 10));
    }
  }

  List<int> _generateReceiptBytes(ReceiptModel receipt) {
    final List<int> bytes = [];
    
    // ESC/POS Commands
    const init = [0x1b, 0x40];
    const center = [0x1b, 0x61, 0x01];
    const left = [0x1b, 0x61, 0x00];
    const boldOn = [0x1b, 0x45, 0x01];
    const boldOff = [0x1b, 0x45, 0x00];
    const largeOn = [0x1b, 0x21, 0x30];
    const largeOff = [0x1b, 0x21, 0x00];
    const cut = [0x1d, 0x56, 0x42, 0x00];

    // Helper to sanitize Turkish and encode
    List<int> t(String text) {
      final sanitized = text
          .replaceAll('Ğ', 'G').replaceAll('ğ', 'g')
          .replaceAll('Ü', 'U').replaceAll('ü', 'u')
          .replaceAll('Ş', 'S').replaceAll('ş', 's')
          .replaceAll('İ', 'I').replaceAll('ı', 'i')
          .replaceAll('Ö', 'O').replaceAll('ö', 'o')
          .replaceAll('Ç', 'C').replaceAll('ç', 'c');
      return utf8.encode(sanitized);
    }

    bytes.addAll(init);

    // Business Header
    bytes.addAll(center);
    bytes.addAll(boldOn);
    bytes.addAll(largeOn);
    bytes.addAll(t('${receipt.business.name.toUpperCase()}\n'));
    bytes.addAll(largeOff);
    bytes.addAll(boldOff);
    
    if (receipt.business.phone != null) {
      bytes.addAll(t('${receipt.business.phone}\n'));
    }
    bytes.addAll(t('--------------------------------\n'));

    // Receipt Body
    bytes.addAll(left);
    bytes.addAll(t('MAKBUZ NO: ${receipt.id.substring(0, 8).toUpperCase()}\n'));
    bytes.addAll(t('TARIH: ${DateFormat('dd.MM.yyyy HH:mm').format(receipt.createdAt)}\n'));
    bytes.addAll(t('--------------------------------\n'));
    bytes.addAll(t('MUSTERI: ${receipt.serviceRequest.customer.name}\n'));
    bytes.addAll(t('HIZMET: ${receipt.serviceRequest.description}\n'));
    bytes.addAll(t('--------------------------------\n'));

    // Price
    bytes.addAll(boldOn);
    bytes.addAll(largeOn);
    bytes.addAll(t('TOPLAM: ${receipt.price.toStringAsFixed(2)} TL\n'));
    bytes.addAll(largeOff);
    bytes.addAll(boldOff);

    // Footer
    bytes.addAll(center);
    bytes.addAll(t('\nIyi gunler dileriz.\n'));
    
    // Spacing and Cut
    bytes.addAll([0x0a, 0x0a, 0x0a, 0x0a]); 
    bytes.addAll(cut);

    return bytes;
  }

  void disconnect() {
    _device?.disconnect();
    _device = null;
    _characteristic = null;
  }
}
