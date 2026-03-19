import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';

class ChatBotOverlay extends ConsumerStatefulWidget {
  final Widget child;
  const ChatBotOverlay({super.key, required this.child});

  @override
  ConsumerState<ChatBotOverlay> createState() => _ChatBotOverlayState();
}

class _ChatBotOverlayState extends ConsumerState<ChatBotOverlay> {
  bool _isChatVisible = false;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isAuthenticated = authState.user != null;

    if (!isAuthenticated) return widget.child;

    final bottomPadding = MediaQuery.of(context).padding.bottom;
    final keyboardHeight = MediaQuery.of(context).viewInsets.bottom;

    return Stack(
      children: [
        widget.child,
        // The Floating Button (Bottom Right)
        Positioned(
          right: 20,
          bottom: bottomPadding + 85,
          child: GestureDetector(
            onTap: () => setState(() => _isChatVisible = !_isChatVisible),
            child: FadeInRight(
              child: Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2D31FA), Color(0xFF5D8BF4)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2D31FA).withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 2,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.sparkles, color: Colors.white, size: 24),
              ),
            ),
          ),
        ),
        // The Chat Window (Bottom Right)
        if (_isChatVisible)
          Positioned(
            right: 20,
            bottom: bottomPadding + (keyboardHeight > 0 ? keyboardHeight + 20 : 155),
            child: FadeInUp(
              duration: const Duration(milliseconds: 300),
              child: Material(
                color: Colors.transparent,
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  height: 400,
                  constraints: const BoxConstraints(maxWidth: 320, maxHeight: 450),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 30, spreadRadius: 5),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(28),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildChatHeader(),
                        const Expanded(child: _ChatMessages()),
                        _buildChatInput(),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildChatHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: const BoxDecoration(color: Color(0xFF2D31FA)),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
            child: const Icon(LucideIcons.bot, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('AI Merchant', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                Text('Online & ready', style: TextStyle(color: Colors.white70, fontSize: 10)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(LucideIcons.x, color: Colors.white, size: 16),
            onPressed: () => setState(() => _isChatVisible = false),
          ),
        ],
      ),
    );
  }

  Widget _buildChatInput() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade100)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
              child: const TextField(
                style: TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'Type a message...',
                  hintStyle: TextStyle(fontSize: 12),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: Color(0xFF2D31FA), shape: BoxShape.circle),
            child: const Icon(LucideIcons.send, color: Colors.white, size: 14),
          ),
        ],
      ),
    );
  }
}

class _ChatMessages extends StatelessWidget {
  const _ChatMessages();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      physics: const BouncingScrollPhysics(),
      children: [
        _buildBubble('Welcome back! I can help you track orders or find top-rated items. What\'s on your mind?', false),
        _buildBubble('Where is my recent order?', true),
        _buildBubble('I can check that for you. Please wait a second...', false),
      ],
    );
  }

  Widget _buildBubble(String text, bool isUser) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isUser ? const Color(0xFF2D31FA) : const Color(0xFFF1F4FF),
          borderRadius: BorderRadius.circular(16).copyWith(
            topLeft: isUser ? const Radius.circular(16) : Radius.zero,
            topRight: isUser ? Radius.zero : const Radius.circular(16),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isUser ? Colors.white : AppColors.textMain,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
