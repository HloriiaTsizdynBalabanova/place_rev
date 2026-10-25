import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Основна кнопка дії (синя, суцільна).
class PrimaryButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;

  const PrimaryButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return _AppButton(
      label: label,
      icon: icon,
      onPressed: onPressed,
      background: AppColors.primary,
      foreground: Colors.white,
    );
  }
}

/// Другорядна кнопка (світла заливка).
class SecondaryButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;

  const SecondaryButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return _AppButton(
      label: label,
      icon: icon,
      onPressed: onPressed,
      background: AppColors.infoBg,
      foreground: AppColors.primary,
    );
  }
}

class _AppButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;
  final Color background;
  final Color foreground;

  const _AppButton({
    required this.label,
    required this.icon,
    required this.onPressed,
    required this.background,
    required this.foreground,
  });

  @override
  Widget build(BuildContext context) {
    final text = Text(
      label,
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
    );
    final style = FilledButton.styleFrom(
      backgroundColor: background,
      foregroundColor: foreground,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
    );
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: icon == null
          ? FilledButton(onPressed: onPressed, style: style, child: text)
          : FilledButton.icon(
              onPressed: onPressed,
              style: style,
              icon: Icon(icon, size: 20),
              label: text,
            ),
    );
  }
}
