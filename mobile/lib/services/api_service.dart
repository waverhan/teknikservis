import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import '../models/user.dart';
import '../models/receipt.dart';

class ApiService {
  final String _baseUrl = Constants.apiUrl;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {
        'token': data['token'],
        'user': UserModel.fromJson(data['business']),
      };
    } else {
      throw Exception(data['error'] ?? 'Giriş yapılamadı');
    }
  }

  Future<ReceiptModel> fetchReceipt(String receiptId, String token) async {
    // Note: We use the existing API for receipts
    final response = await http.get(
      Uri.parse('$_baseUrl/api/receipts/$receiptId'), // Note: might need update on Next side to support single fetch if not exists
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'token=$token', // Or Authorization header if middleware updated
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return ReceiptModel.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Makbuz bilgileri alınamadı');
    }
  }
}
