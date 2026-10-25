import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/form_card.dart';
import '../home/main_shell.dart';
import 'auth_store.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  bool _agreed = false;

  String? _firstNameError;
  String? _lastNameError;
  String? _emailError;
  String? _passwordError;
  String? _confirmError;
  String? _agreeError;

  @override
  void dispose() {
    for (final c in [_firstName, _lastName, _email, _password, _confirm]) {
      c.dispose();
    }
    super.dispose();
  }

  void _register() {
    final firstErr = Validators.name(_firstName.text, "ім'я");
    final lastErr = Validators.name(_lastName.text, 'прізвище');
    var emailErr = Validators.email(_email.text);
    if (emailErr == null && AuthStore.emailExists(_email.text)) {
      emailErr = 'Акаунт із такою поштою вже існує';
    }
    final passErr = Validators.password(_password.text);
    final confirmErr = Validators.confirm(_password.text, _confirm.text);
    final agreeErr =
        _agreed ? null : 'Потрібно погодитися з правилами, щоб продовжити';

    setState(() {
      _firstNameError = firstErr;
      _lastNameError = lastErr;
      _emailError = emailErr;
      _passwordError = passErr;
      _confirmError = confirmErr;
      _agreeError = agreeErr;
    });

    if ([firstErr, lastErr, emailErr, passErr, confirmErr, agreeErr]
        .any((e) => e != null)) {
      return;
    }

    AuthStore.register(_email.text, _password.text);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Акаунт створено. Ласкаво просимо!')),
    );
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => const MainShell()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(showBack: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.normal),
        child: Column(
          children: [
            FormCard(
              color: AppColors.infoBg,
              padding: const EdgeInsets.all(AppSpacing.medium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Реєстрація',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: AppSpacing.small),
                  const Text(
                    'Створення облікового запису дослідника для верифікації '
                    'локацій та оцінок.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.normal),
            FormCard(
              child: Column(
                children: [
                  AppTextField(
                    label: "Ім'я",
                    isRequired: true,
                    tag: 'Текст',
                    hint: "Введіть ім'я",
                    icon: Icons.person_outline,
                    controller: _firstName,
                    helperText:
                        "Введіть офіційне ім'я для студентського профілю",
                    errorText: _firstNameError,
                    onChanged: (_) => setState(() => _firstNameError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Прізвище',
                    isRequired: true,
                    tag: 'Текст',
                    hint: 'Введіть прізвище',
                    icon: Icons.badge_outlined,
                    controller: _lastName,
                    errorText: _lastNameError,
                    onChanged: (_) => setState(() => _lastNameError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Електронна пошта',
                    isRequired: true,
                    hint: 'name@domain.com',
                    icon: Icons.mail_outline,
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    errorText: _emailError,
                    onChanged: (_) => setState(() => _emailError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Пароль',
                    isRequired: true,
                    tag: 'Захист',
                    hint: 'Введіть пароль',
                    icon: Icons.lock_outline,
                    isPassword: true,
                    controller: _password,
                    helperText: 'Мінімум 8 символів, літери та цифри',
                    errorText: _passwordError,
                    onChanged: (_) => setState(() => _passwordError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Підтвердження пароля',
                    isRequired: true,
                    hint: 'Повторіть пароль',
                    icon: Icons.lock_reset,
                    isPassword: true,
                    controller: _confirm,
                    errorText: _confirmError,
                    onChanged: (_) => setState(() => _confirmError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  Container(
                    decoration: BoxDecoration(
                      color: _agreeError != null
                          ? AppColors.fieldError
                          : AppColors.field,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: CheckboxListTile(
                      value: _agreed,
                      onChanged: (v) => setState(() {
                        _agreed = v ?? false;
                        _agreeError = null;
                      }),
                      controlAffinity: ListTileControlAffinity.leading,
                      dense: true,
                      title: const Text(
                        'Я погоджуюся з правилами академічної доброчесності '
                        'та збереженням персонального журналу візитів',
                        style: TextStyle(fontSize: 13),
                      ),
                    ),
                  ),
                  if (_agreeError != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          _agreeError!,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.error,
                          ),
                        ),
                      ),
                    ),
                  const SizedBox(height: AppSpacing.normal),
                  PrimaryButton(
                    label: 'Зареєструватися',
                    icon: Icons.how_to_reg_outlined,
                    onPressed: _register,
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Вже маєте акаунт?'),
                      TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: const Text('Увійти'),
                      ),
                    ],
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
