import '../core/api/api_client.dart';
import '../models/auth_response.dart';

class AuthRepository {
  final ApiClient _apiClient;

  AuthRepository(this._apiClient);

  Future<AuthResponse> login(String username, String password) async {
    try {
      final response = await _apiClient.dio.post('/auth/login', data: {
        'username': username,
        'password': password,
      });
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthResponse> register(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.dio.post('/auth/register', data: data);
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
