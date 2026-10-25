import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Верхня панель: назва застосунку, опційна кнопка «назад» та аватар.
class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  final bool showBack;
  final String? badge;

  const AppTopBar({super.key, this.showBack = false, this.badge});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.background,
      surfaceTintColor: Colors.transparent,
      automaticallyImplyLeading: false,
      leading: showBack
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.of(context).maybePop(),
            )
          : null,
      titleSpacing: showBack ? 0 : 20,
      title: const Text(
        'Place_rev',
        style: TextStyle(
          fontWeight: FontWeight.w800,
          color: AppColors.primary,
          fontSize: 20,
        ),
      ),
      actions: [
        if (badge != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.mint,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              badge!,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: AppColors.teal,
              ),
            ),
          ),
        const SizedBox(width: 8),
        const CircleAvatar(
          radius: 18,
          backgroundColor: AppColors.primary,
          child: Icon(Icons.person_outline, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 16),
      ],
    );
  }
}
