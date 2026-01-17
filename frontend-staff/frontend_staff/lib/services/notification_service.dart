import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/notification_item.dart';
import '../utils/app_colors.dart';

class NotificationService {
  final AudioPlayer _audioPlayer = AudioPlayer();
  final List<NotificationItem> _notifications = [];

  List<NotificationItem> get notifications => _notifications;

  Future<void> playNotificationSound() async {
    try {
      // Try to play custom sound (you can add your own sound file)
      // await _audioPlayer.play(AssetSource('sounds/notification.mp3'));

      // Fallback to system sound
      await SystemSound.play(SystemSoundType.alert);
    } catch (e) {
      // If all fails, use system sound
      SystemSound.play(SystemSoundType.alert);
    }
  }

  void addNotification(String message, String type, {bool playSound = false}) {
    _notifications.insert(
      0,
      NotificationItem(message: message, type: type, timestamp: DateTime.now()),
    );

    if (_notifications.length > 50) {
      _notifications.removeLast();
    }

    if (playSound) {
      playNotificationSound();
    }
  }

  void clearAll() {
    _notifications.clear();
  }

  void showSnackbar(BuildContext context, String message, String type) {
    if (!context.mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              type == 'success'
                  ? Icons.check_circle
                  : type == 'warning'
                  ? Icons.warning
                  : Icons.info,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.textPrimary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  void dispose() {
    _audioPlayer.dispose();
  }
}
