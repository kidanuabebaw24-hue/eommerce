class UserProfile {
  final int id;
  final int userId;
  final String username;
  final String fullname;
  final String email;
  final String? profilePhoto;
  final String? bio;
  final String? phone;
  final String? location;
  final String? city;
  final String? country;
  final String verificationStatus;
  final String? businessName;
  final double averageRating;
  final int reviewCount;

  UserProfile({
    required this.id,
    required this.userId,
    required this.username,
    required this.fullname,
    required this.email,
    this.profilePhoto,
    this.bio,
    this.phone,
    this.location,
    this.city,
    this.country,
    required this.verificationStatus,
    this.businessName,
    required this.averageRating,
    required this.reviewCount,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? 0,
      userId: json['userId'] ?? 0,
      username: json['username'] ?? '',
      fullname: json['fullname'] ?? '',
      email: json['email'] ?? '',
      profilePhoto: json['profilePhoto'],
      bio: json['bio'],
      phone: json['phone'],
      location: json['location'],
      city: json['city'],
      country: json['country'],
      verificationStatus: json['verificationStatus'] ?? 'UNVERIFIED',
      businessName: json['businessName'],
      averageRating: (json['averageRating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['reviewCount'] ?? 0,
    );
  }
}
