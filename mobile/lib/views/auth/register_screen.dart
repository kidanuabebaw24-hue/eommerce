import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import 'login_screen.dart';
import 'registration_payment_screen.dart';

class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textMain),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              FadeInDown(
                child: Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(LucideIcons.userPlus, color: Colors.white, size: 30),
                ),
              ),
              const SizedBox(height: 16),
              FadeInDown(
                delay: const Duration(milliseconds: 100),
                child: Text(
                  'Join MarketBridge',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.w900, color: AppColors.textMain),
                ),
              ),
              const SizedBox(height: 8),
              FadeInDown(
                delay: const Duration(milliseconds: 200),
                child: Text(
                  'Start your journey as a buyer or seller',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textMuted),
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 400),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    border: Border.all(color: Colors.blue.shade200),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 2.0),
                        child: Icon(LucideIcons.dollarSign, color: Colors.blue.shade700, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Registration Fee Required', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade900)),
                            const SizedBox(height: 4),
                            Text('A one-time registration fee is required to join our marketplace:', style: TextStyle(fontSize: 13, color: Colors.blue.shade800)),
                            const SizedBox(height: 8),
                            Text('• Buyers: \$10', style: TextStyle(fontSize: 13, color: Colors.blue.shade800)),
                            Text('• Sellers: \$50', style: TextStyle(fontSize: 13, color: Colors.blue.shade800)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              FadeInUp(
                delay: const Duration(milliseconds: 500),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("What you'll get:", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textMain)),
                      const SizedBox(height: 8),
                      const Text('✓ Access to thousands of products', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                      const SizedBox(height: 4),
                      const Text('✓ Secure payment processing', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                      const SizedBox(height: 4),
                      const Text('✓ Buyer protection guarantee', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                      const SizedBox(height: 4),
                      const Text('✓ 24/7 customer support', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 600),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const RegistrationPaymentScreen()));
                  },
                  child: const Text('Continue to Payment', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 700),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Already have an account? '),
                    GestureDetector(
                      onTap: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
                      child: const Text('Log in here', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
