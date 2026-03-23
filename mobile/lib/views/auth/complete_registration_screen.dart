import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/core_providers.dart';

class CompleteRegistrationScreen extends ConsumerStatefulWidget {
  final String paymentId;
  final String role;
  final String email;
  final String fullName;
  final String username;

  const CompleteRegistrationScreen({
    super.key,
    required this.paymentId,
    required this.role,
    required this.email,
    required this.fullName,
    required this.username,
  });

  @override
  ConsumerState<CompleteRegistrationScreen> createState() => _CompleteRegistrationScreenState();
}

class _CompleteRegistrationScreenState extends ConsumerState<CompleteRegistrationScreen> {
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleCompleteRegistration() async {
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (password.isEmpty || confirmPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Passwords do not match')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      await ref.read(authRepositoryProvider).register({
        'fullname': widget.fullName,
        'username': widget.username,
        'email': widget.email,
        'password': password,
        'roles': [widget.role],
        'paymentId': widget.paymentId,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration successful! Please login.')),
        );
        // pop back until login screen
        Navigator.popUntil(context, (route) => route.isFirst);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Complete Registration'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false, // Prevents going back, must finish or cancel
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    border: Border.all(color: Colors.green.shade200),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Icon(LucideIcons.checkCircle, color: Colors.green.shade600, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Payment verified successfully. Please set your password to complete registration.',
                          style: TextStyle(color: Colors.green.shade800, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),
              FadeInDown(
                delay: const Duration(milliseconds: 100),
                child: Column(
                  children: [
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        hintText: 'Password',
                        prefixIcon: Icon(LucideIcons.key, size: 20),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _confirmPasswordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        hintText: 'Confirm Password',
                        prefixIcon: Icon(LucideIcons.key, size: 20),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 200),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _isLoading ? null : _handleCompleteRegistration,
                  child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Complete Registration', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                  child: const Text('Cancel Request', style: TextStyle(color: Colors.grey)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
