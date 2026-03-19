import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/transaction_model.dart';

final purchasesProvider = FutureProvider<List<Transaction>>((ref) async {
  await Future.delayed(const Duration(milliseconds: 500));
  return [
    Transaction(
      id: 1,
      productId: 2,
      productTitle: 'Minimalist Leather Watch',
      amount: 150.00,
      status: 'SUCCESS',
      sellerUsername: 'StyleHub',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
  ];
});

final salesProvider = FutureProvider<List<Transaction>>((ref) async {
  await Future.delayed(const Duration(milliseconds: 500));
  return [
    Transaction(
      id: 2,
      productId: 1,
      productTitle: 'Premium Wireless Headphones',
      amount: 299.99,
      status: 'SUCCESS',
      buyerUsername: 'JohnBuyer',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
  ];
});
