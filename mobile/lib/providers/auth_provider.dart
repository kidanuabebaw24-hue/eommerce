import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/auth_response.dart';

class AuthState {
  final AuthResponse? user;
  final bool isLoading;
  final String? error;

  AuthState({this.user, this.isLoading = false, this.error});

  AuthState copyWith({AuthResponse? user, bool? isLoading, String? error}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());

  Future<bool> login(String username, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    // Simulate API delay
    await Future.delayed(const Duration(seconds: 2));

    // Mock Logic for UI only
    if (username == 'buyer' && password == 'password') {
      final user = AuthResponse(
        token: 'mock_token_buyer',
        username: 'Sample Buyer',
        roles: ['BUYER'],
      );
      state = state.copyWith(user: user, isLoading: false);
      return true;
    } else if (username == 'seller' && password == 'password') {
      final user = AuthResponse(
        token: 'mock_token_seller',
        username: 'Sample Seller',
        roles: ['SELLER'],
      );
      state = state.copyWith(user: user, isLoading: false);
      return true;
    } else {
      state = state.copyWith(
        isLoading: false, 
        error: 'Invalid credentials. Use buyer/password or seller/password.'
      );
      return false;
    }
  }

  Future<void> logout() async {
    state = AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
