import 'package:flutter/material.dart';
import 'core/theme/app_colors.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/login_screen.dart';

void main() {
  runApp(const PlaceRevApp());
}

class PlaceRevApp extends StatelessWidget {
  const PlaceRevApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Place_rev',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      // На десктопі обмежуємо ширину вмісту «мобільним» макетом з Figma.
      builder: (context, child) => ColoredBox(
        color: AppColors.background,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: child,
          ),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
