import '../models/auth_response.dart';

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
    await Future.delayed(const Duration(seconds: 1));
  }
}
