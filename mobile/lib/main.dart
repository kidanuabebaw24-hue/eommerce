import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'views/common/splash_screen.dart';

import 'widgets/chat_bot_overlay.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: MarketBridgeApp(),
    ),
  );
}

class MarketBridgeApp extends StatelessWidget {
  const MarketBridgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MarketBridge',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      builder: (context, child) => ChatBotOverlay(child: child ?? const SizedBox()),
      home: const SplashScreen(),
    );
  }
}
