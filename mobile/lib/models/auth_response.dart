class AuthResponse {
  final String token;
  final String username;
  final List<String> roles;

  AuthResponse({
    required this.token,
    required this.username,
    required this.roles,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      username: json['username'] ?? '',
      roles: List<String>.from(json['roles'] ?? []),
    );
  }

  bool get isSeller => roles.contains('SELLER');
  bool get isAdmin => roles.contains('ADMIN');
}
