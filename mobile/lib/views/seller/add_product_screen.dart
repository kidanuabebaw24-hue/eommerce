import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import 'package:dio/dio.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/core_providers.dart';
import '../../providers/product_provider.dart';

class AddProductScreen extends ConsumerStatefulWidget {
  const AddProductScreen({super.key});

  @override
  ConsumerState<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends ConsumerState<AddProductScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _locationController = TextEditingController();
  String _selectedCategory = '1'; // Placeholder ID
  bool _isLoading = false;

  void _handleSubmit() async {
    if (_titleController.text.isEmpty || _priceController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill title and price')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final formData = FormData.fromMap({
        'title': _titleController.text,
        'description': _descriptionController.text,
        'price': double.parse(_priceController.text),
        'location': _locationController.text,
        'categoryId': _selectedCategory,
      });

      await ref.read(productRepositoryProvider).createProduct(formData);
      ref.invalidate(myProductsProvider);
      ref.invalidate(productsProvider);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Product added successfully!')));
        // Clear fields
        _titleController.clear();
        _descriptionController.clear();
        _priceController.clear();
        _locationController.clear();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Add New Product', style: TextStyle(fontWeight: FontWeight.w900)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            FadeInDown(
              child: GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Image picker coming soon!')),
                  );
                },
                child: Container(
                  width: double.infinity,
                  height: 150,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.grey.shade100, style: BorderStyle.solid),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(LucideIcons.imagePlus, size: 40, color: AppColors.primary),
                      const SizedBox(height: 8),
                      const Text('Add Product Images', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
            FadeInUp(
              child: Column(
                children: [
                  TextField(
                    controller: _titleController,
                    decoration: const InputDecoration(hintText: 'Product Title', prefixIcon: Icon(LucideIcons.type)),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _descriptionController,
                    maxLines: 4,
                    decoration: const InputDecoration(hintText: 'Description', prefixIcon: Icon(LucideIcons.fileText)),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _priceController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(hintText: 'Price (\$)', prefixIcon: Icon(LucideIcons.dollarSign)),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextField(
                          controller: _locationController,
                          decoration: const InputDecoration(hintText: 'Location', prefixIcon: Icon(LucideIcons.mapPin)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(hintText: 'Category', prefixIcon: Icon(LucideIcons.tag)),
                    items: const [
                      DropdownMenuItem(value: '1', child: Text('Electronics')),
                      DropdownMenuItem(value: '2', child: Text('Fashion')),
                      DropdownMenuItem(value: '3', child: Text('Home')),
                    ],
                    onChanged: (val) => setState(() => _selectedCategory = val!),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleSubmit,
                    child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('List Product'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
