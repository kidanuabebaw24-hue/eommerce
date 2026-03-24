import 'package:dio/dio.dart';
import '../models/auth_response.dart';
import '../core/api/api_client.dart';

class AuthRepository {
  AuthRepository();

  Future<AuthResponse> login(String username, String password) async {
    await Future.delayed(const Duration(seconds: 1));
    if (username == 'buyer') {
      return AuthResponse(token: 'tk', username: 'Buyer', roles: ['BUYER']);
    }
    return AuthResponse(token: 'tk', username: 'Seller', roles: ['SELLER']);
  }

  Future<void> register(Map<String, dynamic> data) async {
    final dio = Dio(BaseOptions(baseUrl: ApiClient.baseUrl));
    try {
      await dio.post('/auth/register', data: data);
    } catch (e) {
      if (e is DioException) {
        throw Exception(e.response?.data['message'] ?? 'Registration failed');
      }
      rethrow;
    }
  }
}
