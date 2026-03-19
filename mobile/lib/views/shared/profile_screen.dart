import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../buyer/wishlist_screen.dart';
import 'personal_info_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              FadeInDown(
                child: Column(
                  children: [
                    Stack(
                      children: [
                        const CircleAvatar(
                          radius: 60,
                          backgroundColor: Colors.white,
                          backgroundImage: NetworkImage('https://via.placeholder.com/150'),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(LucideIcons.camera, color: Colors.white, size: 20),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      user?.username ?? 'Guest User',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900),
                    ),
                    Text(
                      user?.roles.join(', ') ?? '',
                      style: const TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              FadeInUp(
                child: Column(
                  children: [
                    _ProfileTile(
                      icon: LucideIcons.user,
                      title: 'Personal Information',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PersonalInfoScreen())),
                    ),
                    _ProfileTile(
                      icon: LucideIcons.shoppingBag,
                      title: 'My Orders',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const OrdersScreen())),
                    ),
                    _ProfileTile(
                      icon: LucideIcons.heart,
                      title: 'Wishlist',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const WishlistScreen())),
                    ),
                    _ProfileTile(
                      icon: LucideIcons.bell,
                      title: 'Notifications',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
                    ),
                    _ProfileTile(
                      icon: LucideIcons.shieldCheck,
                      title: 'Security',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SecurityScreen())),
                    ),
                    _ProfileTile(
                      icon: LucideIcons.helpCircle,
                      title: 'Help Center',
                      onTap: () => _showComingSoon(context, 'Help Center'),
                    ),
                    const SizedBox(height: 24),
                    _ProfileTile(
                      icon: LucideIcons.logOut,
                      title: 'Logout',
                      color: AppColors.error,
                      onTap: () async {
                        await ref.read(authProvider.notifier).logout();
                        if (context.mounted) {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(builder: (_) => const LoginScreen()),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showComingSoon(BuildContext context, String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$feature feature coming soon!'), duration: const Duration(seconds: 1)),
    );
  }
}

// These would normally be in separate files
class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
      body: const Center(child: Text('You have no active orders.')),
    );
  }
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: const Center(child: Text('No new notifications.')),
    );
  }
}

class SecurityScreen extends StatelessWidget {
  const SecurityScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Security')),
      body: const Center(child: Text('Security settings coming soon.')),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? color;

  const _ProfileTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: (color ?? AppColors.primary).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color ?? AppColors.primary, size: 20),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: color ?? AppColors.textMain,
          ),
        ),
        trailing: const Icon(LucideIcons.chevronRight, size: 16, color: AppColors.textMuted),
      ),
    );
  }
}
