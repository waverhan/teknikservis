import 'package:flutter/material.dart';
import '../models/receipt.dart';
import '../services/bluetooth_printer_service.dart';
import 'package:intl/intl.dart';

class PrintPreviewScreen extends StatefulWidget {
  final ReceiptModel receipt;
  const PrintPreviewScreen({super.key, required this.receipt});

  @override
  State<PrintPreviewScreen> createState() => _PrintPreviewScreenState();
}

class _PrintPreviewScreenState extends State<PrintPreviewScreen> {
  final _bluetoothService = BluetoothPrinterService();
  bool _isPrinting = false;
  String? _statusMessage;

  void _handlePrint() async {
    setState(() {
      _isPrinting = true;
      _statusMessage = 'Yazıcı taranıyor...';
    });

    try {
      final devices = await _bluetoothService.scanDevices();
      if (devices.isEmpty) {
        throw Exception('Yazıcı bulunamadı');
      }

      setState(() => _statusMessage = 'Yazıcıya bağlanılıyor...');
      // Simple logic: connect to the first device found or show a list
      // For MVP, we'll try to connect to the first device
      final connected = await _bluetoothService.connect(devices.first);
      if (!connected) throw Exception('Yazıcı bağlantısı başarısız');

      setState(() => _statusMessage = 'Makbuz yazdırılıyor...');
      await _bluetoothService.printReceipt(widget.receipt);

      if (mounted) {
        setState(() {
          _isPrinting = false;
          _statusMessage = 'Yazdırma başarılı!';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Yazdırma başarılı!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isPrinting = false;
          _statusMessage = 'Hata: $e';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Hata: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Makbuz Yazdır', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Icon(Icons.receipt_long, size: 48, color: Colors.blue),
                  const SizedBox(height: 16),
                  const Text('Makbuz Önizleme', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const Divider(height: 32),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Müşteri:', style: TextStyle(fontWeight: FontWeight.w600)),
                      Text(widget.receipt.serviceRequest.customer.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Servis:', style: TextStyle(fontWeight: FontWeight.w600)),
                      Expanded(
                        child: Text(
                          widget.receipt.serviceRequest.description,
                          textAlign: TextAlign.end,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Toplam:', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                      Text(
                        '${widget.receipt.price} TL',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.blue),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),
            ElevatedButton.icon(
              onPressed: _isPrinting ? null : _handlePrint,
              icon: const Icon(Icons.print),
              label: Text(_isPrinting ? _statusMessage ?? 'Yazdırılıyor...' : 'YAZDIRMAYI BAŞLAT'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(64),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            if (_statusMessage != null) ...[
              const SizedBox(height: 16),
              Text(
                _statusMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
