import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/error_banner.dart';
import '../../core/widgets/form_card.dart';
import '../home/main_shell.dart';
import 'auth_store.dart';
import 'forgot_password_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = true;
  bool _loading = false;
  bool _authFailed = false;
  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final emailErr = Validators.email(_emailController.text);
    final passErr = Validators.required(_passwordController.text, 'пароль');
    setState(() {
      _emailError = emailErr;
      _passwordError = passErr;
      _authFailed = false;
    });
    if (emailErr != null || passErr != null) return;

    setState(() => _loading = true);
    // Імітація запиту до сервера (індикація стану системи).
    await Future<void>.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;

    if (AuthStore.login(_emailController.text, _passwordController.text)) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(builder: (_) => const MainShell()),
      );
    } else {
      setState(() {
        _loading = false;
        _authFailed = true;
      });
    }
  }

  void _fillDemo() {
    setState(() {
      _emailController.text = AuthStore.demoEmail;
      _passwordController.text = AuthStore.demoPassword;
      _authFailed = false;
      _emailError = null;
      _passwordError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.normal),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Авторизація',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                ),
                const Text(
                  'Кабінет дослідника',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.small),
            const Text(
              'Введіть академічні облікові дані для доступу до реєстру '
              'локацій та експертних звітів.',
            ),
            const SizedBox(height: AppSpacing.normal),
            if (_authFailed) ...[
              ErrorBanner(
                title: 'Помилка автентифікації',
                code: 'ERR_AUTH_401',
                message: 'Невірний email або пароль. Перевірте введені дані '
                    'та спробуйте знову.',
                actionLabel: 'Застосувати тестові коректні дані',
                onAction: _fillDemo,
              ),
              const SizedBox(height: AppSpacing.normal),
            ],
            FormCard(
              child: Column(
                children: [
                  AppTextField(
                    label: 'Електронна пошта',
                    isRequired: true,
                    tag: 'Університетський домен',
                    hint: 'student@univ.edu.ua',
                    icon: Icons.alternate_email,
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    errorText: _emailError,
                    onChanged: (_) => setState(() {
                      _emailError = null;
                      _authFailed = false;
                    }),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Пароль',
                    isRequired: true,
                    hint: 'Введіть пароль',
                    icon: Icons.lock_outline,
                    isPassword: true,
                    controller: _passwordController,
                    helperText: 'Мін. 8 символів',
                    errorText: _passwordError,
                    onChanged: (_) => setState(() {
                      _passwordError = null;
                      _authFailed = false;
                    }),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const ForgotPasswordScreen(),
                        ),
                      ),
                      child: const Text('Забули пароль?'),
                    ),
                  ),
                  CheckboxListTile(
                    value: _rememberMe,
                    onChanged: (v) => setState(() => _rememberMe = v ?? false),
                    title: const Text("Запам'ятати мене"),
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  ),
                  const SizedBox(height: AppSpacing.small),
                  PrimaryButton(
                    label: _loading ? 'Зачекайте...' : 'Увійти',
                    icon: _loading ? Icons.hourglass_top : Icons.login,
                    onPressed: _loading ? null : _login,
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: AppSpacing.normal),
                    child: Row(
                      children: [
                        Expanded(child: Divider()),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text('АБО', style: TextStyle(fontSize: 11)),
                        ),
                        Expanded(child: Divider()),
                      ],
                    ),
                  ),
                  SecondaryButton(
                    label: 'Створити акаунт',
                    icon: Icons.person_add_alt,
                    onPressed: _loading
                        ? null
                        : () => Navigator.of(context).push(
                              MaterialPageRoute<void>(
                                builder: (_) => const RegisterScreen(),
                              ),
                            ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.normal),
            const Center(
              child: Text(
                'Демо-акаунт: ${AuthStore.demoEmail} / ${AuthStore.demoPassword}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 11),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
