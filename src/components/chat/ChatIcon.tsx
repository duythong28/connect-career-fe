import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/context/ChatContext';

export const ChatIcon: React.FC = () => {
  const { setIsSearchModalOpen, chatBoxes } = useChatContext();

  const unreadCount = chatBoxes.reduce((total, box) => {
    return total + (box.channel.state?.unreadCount || 0);
  }, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={() => setIsSearchModalOpen(true)}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};