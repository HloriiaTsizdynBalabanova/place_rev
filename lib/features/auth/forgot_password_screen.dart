import 'dart:async';

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/form_card.dart';
import 'auth_store.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _email = TextEditingController();
  bool _sent = false;
  String? _emailError;
  String _sentTo = '';
  int _secondsLeft = 0;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    _email.dispose();
    super.dispose();
  }

  String _mask(String email) {
    final parts = email.trim().split('@');
    return '${parts[0][0]}***@${parts[1]}';
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() => _secondsLeft = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft <= 1) {
        t.cancel();
        setState(() => _secondsLeft = 0);
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  void _send() {
    var err = Validators.email(_email.text);
    if (err == null && !AuthStore.emailExists(_email.text)) {
      err = 'Акаунт із такою поштою не знайдено';
    }
    setState(() => _emailError = err);
    if (err != null) return;

    setState(() {
      _sent = true;
      _sentTo = _mask(_email.text);
    });
    _startTimer();
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
                  const Text(
                    'ВІДНОВЛЕННЯ ПАРОЛЯ ЧЕРЕЗ ЕЛЕКТРОННУ ПОШТУ',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.small),
                  Text(
                    'Скидання пароля',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: AppSpacing.small),
                  const Text(
                    'Введіть зареєстровану електронну адресу, і ми надішлемо '
                    'посилання для відновлення доступу до вашого облікового '
                    'запису в системі оцінювання.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.normal),
            if (_sent) ...[
              _SuccessBanner(
                maskedEmail: _sentTo,
                secondsLeft: _secondsLeft,
                onResend: _send,
              ),
              const SizedBox(height: AppSpacing.normal),
            ],
            FormCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'ФОРМА ВЕРИФІКАЦІЇ',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  AppTextField(
                    label: 'Електронна пошта',
                    isRequired: true,
                    tag: 'Корпоративна / Академічна',
                    hint: 'name@univ.edu.ua',
                    icon: Icons.mail_outline,
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    helperText:
                        'Домен підтримує автоматичну перевірку студентів',
                    errorText: _emailError,
                    onChanged: (_) => setState(() => _emailError = null),
                  ),
                  const SizedBox(height: AppSpacing.normal),
                  PrimaryButton(
                    label: 'Надіслати лист',
                    icon: Icons.send_outlined,
                    onPressed: _secondsLeft > 0 ? null : _send,
                  ),
                  Center(
                    child: TextButton.icon(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.arrow_back, size: 16),
                      label: const Text('Повернутися до авторизації'),
                    ),
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

class _SuccessBanner extends StatelessWidget {
  final String maskedEmail;
  final int secondsLeft;
  final VoidCallback onResend;

  const _SuccessBanner({
    required this.maskedEmail,
    required this.secondsLeft,
    required this.onResend,
  });

  @override
  Widget build(BuildContext context) {
    return FormCard(
      color: const Color(0xFF7BF2D6),
      padding: const EdgeInsets.all(AppSpacing.normal),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              CircleAvatar(
                backgroundColor: AppColors.teal,
                child: Icon(Icons.check, color: Colors.white),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Інструкції для відновлення надіслано!',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.teal,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Лист із захищеним посиланням надіслано на $maskedEmail.',
            style: const TextStyle(color: AppColors.teal),
          ),
          const SizedBox(height: 8),
          const Text(
            'Якщо лист не надійшов упродовж 2-3 хвилин, перевірте папку «Спам».',
            style: TextStyle(fontSize: 12, color: AppColors.teal),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Text(
                  secondsLeft > 0
                      ? 'Повтор через: ${secondsLeft}с'
                      : 'Можна надіслати повторно',
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    color: AppColors.teal,
                  ),
                ),
              ),
              TextButton.icon(
                onPressed: secondsLeft > 0 ? null : onResend,
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Надіслати знову'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
