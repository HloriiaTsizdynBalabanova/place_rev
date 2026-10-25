import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Стилізоване текстове поле з підписом, позначкою, підказкою та помилкою.
class AppTextField extends StatefulWidget {
  final String label;
  final bool isRequired;
  final String? tag;
  final String? hint;
  final IconData? icon;
  final TextEditingController? controller;
  final bool isPassword;
  final String? helperText;
  final String? errorText;
  final TextInputType? keyboardType;
  final ValueChanged<String>? onChanged;

  const AppTextField({
    super.key,
    required this.label,
    this.isRequired = false,
    this.tag,
    this.hint,
    this.icon,
    this.controller,
    this.isPassword = false,
    this.helperText,
    this.errorText,
    this.keyboardType,
    this.onChanged,
  });

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _obscure = true;

  OutlineInputBorder _border([Color? color]) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: color == null
            ? BorderSide.none
            : BorderSide(color: color, width: 1.5),
      );

  @override
  Widget build(BuildContext context) {
    final hasError = widget.errorText != null;
    const labelStyle = TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text.rich(
                TextSpan(
                  text: widget.label,
                  style: labelStyle,
                  children: [
                    if (widget.isRequired)
                      const TextSpan(
                        text: ' *',
                        style: TextStyle(color: AppColors.error),
                      ),
                  ],
                ),
              ),
            ),
            if (widget.tag != null)
              Text(
                widget.tag!.toUpperCase(),
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: hasError ? AppColors.error : AppColors.textSecondary,
                ),
              ),
          ],
        ),
        const SizedBox(height: 6),
        TextField(
          controller: widget.controller,
          obscureText: widget.isPassword && _obscure,
          keyboardType: widget.keyboardType,
          onChanged: widget.onChanged,
          decoration: InputDecoration(
            hintText: widget.hint,
            filled: true,
            fillColor: hasError ? AppColors.fieldError : AppColors.field,
            prefixIcon: widget.icon == null
                ? null
                : Icon(
                    widget.icon,
                    color: hasError ? AppColors.error : AppColors.textSecondary,
                  ),
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      _obscure
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                    ),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  )
                : null,
            border: _border(),
            enabledBorder: _border(hasError ? AppColors.error : null),
            focusedBorder: _border(AppColors.primary),
          ),
        ),
        if (hasError || widget.helperText != null) ...[
          const SizedBox(height: 4),
          Text(
            widget.errorText ?? widget.helperText!,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: hasError ? AppColors.error : AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}
