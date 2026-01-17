import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/notification_item.dart';
import '../utils/app_colors.dart';

class NotificationService {
  final AudioPlayer _audioPlayer = AudioPlayer();
  final List<NotificationItem> _notifications = [];
  bool _isInitialized = false;

  List<NotificationItem> get notifications => _notifications;

  /// Initialize the audio player with settings
  Future<void> _initAudioPlayer() async {
    if (_isInitialized) return;
    
    try {
      await _audioPlayer.setReleaseMode(ReleaseMode.stop);
      await _audioPlayer.setVolume(0.7);
      _isInitialized = true;
    } catch (e) {
      debugPrint('Audio player initialization failed: $e');
    }
  }

  /// Play notification sound based on type
  Future<void> playNotificationSound({String type = 'info'}) async {
    try {
      await _initAudioPlayer();
      
      // Generate a beep sound using audio player
      // Since we may not have a sound file, use system sound as primary
      // and add haptic feedback for better user experience
      
      // Haptic feedback for notification
      switch (type) {
        case 'success':
          await HapticFeedback.mediumImpact();
          break;
        case 'warning':
          await HapticFeedback.heavyImpact();
          break;
        case 'error':
          await HapticFeedback.vibrate();
          break;
        default:
          await HapticFeedback.lightImpact();
      }

      // Play system alert sound
      await SystemSound.play(SystemSoundType.alert);
      
      // Try to play custom sound file if available
      try {
        String soundFile = _getSoundFile(type);
        await _audioPlayer.play(AssetSource(soundFile));
      } catch (e) {
        // Sound file not found, system sound already played
        debugPrint('Custom sound not available: $e');
      }
    } catch (e) {
      // Fallback to basic system sound
      debugPrint('Sound playback failed: $e');
      SystemSound.play(SystemSoundType.alert);
    }
  }

  /// Get sound file based on notification type
  String _getSoundFile(String type) {
    switch (type) {
      case 'success':
        return 'sounds/success.mp3';
      case 'warning':
        return 'sounds/warning.mp3';
      case 'error':
        return 'sounds/error.mp3';
      default:
        return 'sounds/notification.mp3';
    }
  }

  /// Add a notification with optional sound
  void addNotification(String message, String type, {bool playSound = false}) {
    _notifications.insert(
      0,
      NotificationItem(
        message: message,
        type: type,
        timestamp: DateTime.now(),
      ),
    );

    // Keep only last 50 notifications
    if (_notifications.length > 50) {
      _notifications.removeLast();
    }

    // Play sound if requested
    if (playSound) {
      playNotificationSound(type: type);
    }
  }

  /// Clear all notifications
  void clearAll() {
    _notifications.clear();
  }

  /// Show snackbar notification
  void showSnackbar(BuildContext context, String message, String type) {
    if (!context.mounted) return;

    Color bgColor;
    IconData icon;

    switch (type) {
      case 'success':
        bgColor = AppColors.success;
        icon = Icons.check_circle_rounded;
        break;
      case 'warning':
        bgColor = AppColors.warning;
        icon = Icons.warning_rounded;
        break;
      case 'error':
        bgColor = AppColors.error;
        icon = Icons.error_rounded;
        break;
      default:
        bgColor = AppColors.info;
        icon = Icons.info_rounded;
    }

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        backgroundColor: bgColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
        elevation: 4,
      ),
    );
  }

  /// Dispose audio player resources
  void dispose() {
    _audioPlayer.dispose();
  }
}
