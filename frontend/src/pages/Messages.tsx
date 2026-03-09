import React, { useState, useEffect } from 'react';
import { messageService } from '../services/api';
import '../styles/Messages.css';

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (userId: number) => {
    try {
      const response = await messageService.getConversation(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    loadConversation(user.user_id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      await messageService.sendMessage(selectedUser.user_id, messageText);
      setMessageText('');
      loadConversation(selectedUser.user_id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h2>Conversations</h2>
        {conversations.map((conv) => (
          <div
            key={conv.user_id}
            className={`conversation-item ${selectedUser?.user_id === conv.user_id ? 'active' : ''}`}
            onClick={() => handleSelectUser(conv)}
          >
            {conv.avatar_url && <img src={conv.avatar_url} alt={conv.username} />}
            <span>{conv.username}</span>
          </div>
        ))}
      </div>

      {selectedUser ? (
        <div className="chat-window">
          <div className="chat-header">
            <h2>{selectedUser.username}</h2>
          </div>
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <p>{msg.message_text}</p>
                <small>{new Date(msg.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="no-selection">Select a conversation to start messaging</div>
      )}
    </div>
  );
};

export default Messages;
