import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../core/api/api_client.dart';
import 'registration_verify_screen.dart';

class RegistrationPaymentScreen extends StatefulWidget {
  const RegistrationPaymentScreen({super.key});

  @override
  State<RegistrationPaymentScreen> createState() => _RegistrationPaymentScreenState();
}

class _RegistrationPaymentScreenState extends State<RegistrationPaymentScreen> {
  String _selectedRole = 'BUYER';
  double _buyerFee = 10.0;
  double _sellerFee = 50.0;
  bool _isLoading = false;
  
  final _emailController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _usernameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchFees();
  }

  Future<void> _fetchFees() async {
    try {
      final response = await ApiClient().dio.get('/registration-payment/fees');
      if (mounted) {
        setState(() {
          _buyerFee = (response.data['BUYER'] ?? 10.0).toDouble();
          _sellerFee = (response.data['SELLER'] ?? 50.0).toDouble();
        });
      }
    } catch (e) {
      debugPrint('Failed to fetch fees: $e');
    }
  }

  Future<void> _handlePayment() async {
    final email = _emailController.text.trim();
    final fullName = _fullNameController.text.trim();
    final username = _usernameController.text.trim();

    if (email.isEmpty || fullName.isEmpty || username.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);
    
    try {
      final currentFee = _selectedRole == 'BUYER' ? _buyerFee : _sellerFee;
      final response = await ApiClient().dio.post('/registration-payment/initiate', data: {
        'email': email,
        'fullName': fullName,
        'username': username,
        'userRole': _selectedRole,
        'amount': currentFee,
        'paymentMethod': 'CHAPA'
      });

      final paymentReference = response.data['paymentReference'];
      final checkoutUrl = response.data['checkoutUrl'];
      
      if (checkoutUrl != null) {
        if (!await launchUrl(Uri.parse(checkoutUrl), mode: LaunchMode.externalApplication)) {
          throw Exception('Could not launch payment URL');
        }
        
        if (mounted) {
          Navigator.push(context, MaterialPageRoute(builder: (_) => RegistrationVerifyScreen(
            paymentId: paymentReference,
            role: _selectedRole,
            fullName: fullName,
            email: email,
            username: username,
          )));
        }
      } else {
        throw Exception('No checkout URL received');
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
    final currentFee = _selectedRole == 'BUYER' ? _buyerFee : _sellerFee;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Registration Payment'),
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              FadeInDown(
                child: Text(
                  'Your Information',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              FadeInDown(
                delay: const Duration(milliseconds: 100),
                child: Column(
                  children: [
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        hintText: 'Email address',
                        prefixIcon: Icon(LucideIcons.mail, size: 20),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _fullNameController,
                      decoration: const InputDecoration(
                        hintText: 'Full name',
                        prefixIcon: Icon(LucideIcons.user, size: 20),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _usernameController,
                      decoration: const InputDecoration(
                        hintText: 'Username',
                        prefixIcon: Icon(LucideIcons.atSign, size: 20),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 200),
                child: Text(
                  'Select Your Role',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              FadeInUp(
                delay: const Duration(milliseconds: 300),
                child: Column(
                  children: [
                    _buildRoleCard('Buyer', 'Browse and purchase products', _buyerFee, 'BUYER'),
                    const SizedBox(height: 12),
                    _buildRoleCard('Seller', 'List and sell your products', _sellerFee, 'SELLER'),
                  ],
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
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Registration Fee (${_selectedRole})', style: TextStyle(color: Colors.grey.shade700)),
                      Text('\$$currentFee', style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold, fontSize: 20)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              FadeInUp(
                delay: const Duration(milliseconds: 500),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _isLoading ? null : _handlePayment,
                  child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : Text('Pay \$$currentFee & Continue', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  'By proceeding, you agree to our terms and conditions.\nThis is a one-time registration fee.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard(String title, String subtitle, double fee, String value) {
    bool isSelected = _selectedRole == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedRole = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue.shade50 : Colors.white,
          border: Border.all(color: isSelected ? Colors.blue.shade400 : Colors.grey.shade300, width: isSelected ? 2 : 1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
              color: isSelected ? Colors.blue.shade600 : Colors.grey.shade400,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('\$$fee', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
