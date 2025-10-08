import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data
  const conversations = [
    {
      id: '1',
      participant: {
        name: 'Ahmet Yılmaz',
        avatar: null,
        type: 'driver'
      },
      lastMessage: 'Teşekkürler, yarın görüşürüz.',
      timestamp: '14:30',
      unreadCount: 2,
      jobTitle: 'İstanbul - Ankara Parsiyel Taşımacılığı'
    },
    {
      id: '2',
      participant: {
        name: 'ABC Lojistik A.Ş.',
        avatar: null,
        type: 'employer'
      },
      lastMessage: 'Teklifiniz kabul edildi.',
      timestamp: '10:15',
      unreadCount: 0,
      jobTitle: 'İzmir - Antalya Konteyner'
    },
    {
      id: '3',
      participant: {
        name: 'Mehmet Kaya',
        avatar: null,
        type: 'driver'
      },
      lastMessage: 'Hangi saatte başlayacağız?',
      timestamp: '09:45',
      unreadCount: 1,
      jobTitle: 'Bursa - Gaziantep Frigo'
    }
  ];

  const messages = selectedConversation ? [
    {
      id: 1,
      sender: 'Ahmet Yılmaz',
      content: 'Merhaba, iş ilanınızı gördüm. Teklif verebilir miyim?',
      timestamp: '14:00',
      isOwn: false
    },
    {
      id: 2,
      sender: 'Siz',
      content: 'Tabii ki, detayları paylaşabilir misiniz?',
      timestamp: '14:05',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Ahmet Yılmaz',
      content: '5 yıllık deneyimim var, C+E ehliyetim mevcut.',
      timestamp: '14:15',
      isOwn: false
    },
    {
      id: 4,
      sender: 'Siz',
      content: 'Harika, 2500 TL teklif ediyorum.',
      timestamp: '14:20',
      isOwn: true
    },
    {
      id: 5,
      sender: 'Ahmet Yılmaz',
      content: 'Teşekkürler, yarın görüşürüz.',
      timestamp: '14:30',
      isOwn: false
    }
  ] : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Send message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
          <p className="mt-2 text-gray-600">
            Tüm konuşmalarınızı buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Konuşmalar</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participant.name}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.jobTitle}
                        </p>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {conversation.timestamp}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            conversation.participant.type === 'driver'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {conversation.participant.type === 'driver' ? 'Tırcı' : 'Şirket'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="submit"
                      className="btn-primary flex items-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Konuşma seçin
                  </h3>
                  <p className="text-gray-600">
                    Sol taraftan bir konuşma seçerek mesajlaşmaya başlayın.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

