import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/api/api_client.dart';
import '../repositories/auth_repository.dart';
import '../repositories/product_repository.dart';
import '../repositories/transaction_repository.dart';

final authRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepository(apiClient);
});

final productRepositoryProvider = Provider((ref) => ProductRepository());
final transactionRepositoryProvider = Provider((ref) => TransactionRepository());
