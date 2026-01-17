import 'package:flutter/material.dart';
import '../models/notification_item.dart';
import '../utils/app_colors.dart';

class NotificationSheet extends StatelessWidget {
  final List<NotificationItem> notifications;
  final VoidCallback onClearAll;

  const NotificationSheet({
    super.key,
    required this.notifications,
    required this.onClearAll,
  });

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);

    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            _buildHandle(),
            _buildHeader(),
            Expanded(
              child: notifications.isEmpty
                  ? _buildEmptyState()
                  : _buildNotificationList(scrollController),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHandle() {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Notifications',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          if (notifications.isNotEmpty)
            TextButton(onPressed: onClearAll, child: const Text('Clear All')),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            'No notifications yet',
            style: TextStyle(fontSize: 16, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationList(ScrollController scrollController) {
    return ListView.builder(
      controller: scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final notif = notifications[index];
        return _buildNotificationItem(notif);
      },
    );
  }

  Widget _buildNotificationItem(NotificationItem notif) {
    final Color bgColor = notif.type == 'success'
        ? AppColors.successLight
        : notif.type == 'warning'
        ? AppColors.warningLight
        : AppColors.infoLight;

    final Color borderColor = notif.type == 'success'
        ? AppColors.success
        : notif.type == 'warning'
        ? AppColors.warning
        : AppColors.info;

    final Color iconColor = borderColor;

    final IconData icon = notif.type == 'success'
        ? Icons.check_circle
        : notif.type == 'warning'
        ? Icons.warning
        : Icons.info;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor.withValues(alpha: 0.3), width: 1),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  notif.message,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatTime(notif.timestamp),
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
