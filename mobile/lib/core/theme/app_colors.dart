import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF2563EB); // blue-600
  static const Color primaryDark = Color(0xFF1E40AF); // blue-800
  static const Color primaryLight = Color(0xFFDBEAFE); // blue-100
  
  static const Color background = Color(0xFFF8FAFC); // slate-50
  static const Color surface = Colors.white;
  
  static const Color textMain = Color(0xFF0F172A); // slate-900
  static const Color textMuted = Color(0xFF64748B); // slate-500
  
  static const Color error = Color(0xFFEF4444); // red-500
  static const Color success = Color(0xFF10B981); // emerald-500
  static const Color warning = Color(0xFFF59E0B); // amber-500

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
