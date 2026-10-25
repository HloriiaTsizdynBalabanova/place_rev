import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/form_card.dart';
import '../auth/auth_store.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _current = TextEditingController();
  final _new = TextEditingController();
  final _confirm = TextEditingController();

  String? _currentError;
  String? _newError;
  String? _confirmError;

  @override
  void dispose() {
    _current.dispose();
    _new.dispose();
    _confirm.dispose();
    super.dispose();
  }

  bool get _hasLength => _new.text.length >= 8;
  bool get _hasDigit => _new.text.contains(RegExp(r'\d'));
  bool get _hasSpecial => _new.text.contains(RegExp(r'[!@#$%^&*]'));

  int get _strength =>
      [_hasLength, _hasDigit, _hasSpecial].where((e) => e).length;

  void _submit() {
    String? currentErr;
    String? newErr;
    String? confirmErr;

    if (_current.text.isEmpty) {
      currentErr = 'Введіть поточний пароль';
    } else if (!AuthStore.checkPassword(_current.text)) {
      currentErr = 'Поточний пароль введено неправильно';
    }

    if (_new.text.isEmpty) {
      newErr = 'Введіть новий пароль';
    } else if (_strength < 3) {
      newErr = 'Новий пароль не відповідає вимогам стійкості';
    } else if (_new.text == _current.text) {
      newErr = 'Новий пароль має відрізнятися від поточного';
    }

    if (_confirm.text.isEmpty) {
      confirmErr = 'Підтвердіть новий пароль';
    } else if (_confirm.text != _new.text) {
      confirmErr = 'Паролі не співпадають';
    }

    setState(() {
      _currentError = currentErr;
      _newError = newErr;
      _confirmError = confirmErr;
    });
    if (currentErr != null || newErr != null || confirmErr != null) return;

    AuthStore.changePassword(_new.text);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Пароль успішно змінено')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(showBack: true, badge: 'ПРОФІЛЬ'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.normal),
        child: Column(
          children: [
            const FormCard(
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.infoBg,
                    child: Icon(Icons.lock_outline, color: AppColors.primary),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Політика конфіденційності',
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w800)),
                        Text('Оновіть ключ для доступу до рецензій'),
                        SizedBox(height: 4),
                        Text('Остання зміна: 42 дні тому',
                            style: TextStyle(fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.normal),
            FormCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppTextField(
                    label: 'Поточний пароль',
                    hint: 'Введіть чинний пароль',
                    icon: Icons.lock_outline,
                    isPassword: true,
                    controller: _current,
                    errorText: _currentError,
                    onChanged: (_) => setState(() => _currentError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Новий пароль',
                    hint: 'Створіть надійну комбінацію',
                    icon: Icons.vpn_key_outlined,
                    isPassword: true,
                    controller: _new,
                    errorText: _newError,
                    onChanged: (_) => setState(() => _newError = null),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      for (var i = 0; i < 3; i++) ...[
                        Expanded(
                          child: Container(
                            height: 6,
                            decoration: BoxDecoration(
                              color: i < _strength
                                  ? AppColors.teal
                                  : AppColors.field,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                        if (i < 2) const SizedBox(width: 6),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.field,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('ВИМОГИ ДО СТІЙКОСТІ:',
                            style: TextStyle(
                                fontWeight: FontWeight.w800, fontSize: 12)),
                        const SizedBox(height: 6),
                        _Requirement(
                            text: 'Мінімум 8 символів', done: _hasLength),
                        _Requirement(
                            text: 'Принаймні одна цифра', done: _hasDigit),
                        _Requirement(
                            text: r'Спеціальний символ (!@#$%^&*)',
                            done: _hasSpecial),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Підтвердження нового пароля',
                    hint: 'Повторіть новий пароль',
                    icon: Icons.lock_reset,
                    isPassword: true,
                    controller: _confirm,
                    helperText: 'Паролі мають співпадати',
                    errorText: _confirmError,
                    onChanged: (_) => setState(() => _confirmError = null),
                  ),
                  const SizedBox(height: AppSpacing.medium),
                  PrimaryButton(
                    label: 'Змінити пароль',
                    icon: Icons.done_all,
                    onPressed: _submit,
                  ),
                  const SizedBox(height: 12),
                  SecondaryButton(
                    label: 'Скасувати',
                    onPressed: () => Navigator.of(context).pop(),
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

class _Requirement extends StatelessWidget {
  final String text;
  final bool done;

  const _Requirement({required this.text, required this.done});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Icon(
            done ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 18,
            color: done ? AppColors.teal : AppColors.textSecondary,
          ),
          const SizedBox(width: 8),
          Text(text),
        ],
      ),
    );
  }
}
