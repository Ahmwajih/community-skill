import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/lib/features/chat/chatSlice';
import { selectedUserById } from '@/lib/features/dashboard/userSlice';
import { RootState } from '@/lib/store';
import pusher from '@/Utils/socket';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const ChatMessages = ({ conversation, user }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const fetchUserDetails = useCallback(async (userId) => {
    if (!users[userId]) {
      const action = await dispatch(selectedUserById(userId));
      if (!action.error) {
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: action.payload.data }));
      }
    }
  }, [dispatch, users]);

  useEffect(() => {
    const initializeConversation = async () => {
      if (conversation) {
        setMessages(conversation.messages || []);
        const providerId = conversation.providerId._id === user.id ? conversation.seekerId._id : conversation.providerId._id;
        await fetchUserDetails(providerId);
        setProvider(users[providerId]);

        for (const msg of conversation.messages) {
          const userId = msg.senderId;
          await fetchUserDetails(userId);
        }
      }
    };

    initializeConversation();
  }, [conversation, fetchUserDetails, user.id, users]);

  useEffect(() => {
    const channel = pusher.subscribe(`conversation-${conversation?._id}`);
    channel.bind('receive_message', (message) => {
      dispatch(addMessage({ conversationId: conversation?._id, message }));
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversation?._id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    const message = {
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');

    try {
      await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...message, conversationId: conversation?._id }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date) => {
    const now = dayjs();
    const messageDate = dayjs(date);
    if (now.isSame(messageDate, 'day')) {
      return `Today at ${messageDate.format('HH:mm')}`;
    }
    return messageDate.format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      {provider && (
        <div className="flex items-center p-4 bg-white border border-y-2 cursor-pointer" onClick={() => router.push(`/skill_provider_details/${provider._id}`)}>
          <img src={provider.photo} alt={provider.name} className="h-8 w-8 rounded-full mr-2" />
          <span className="font-semibold">{provider.name}</span>
        </div>
      )}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start mb-3 ${msg.senderId === user.id ? 'justify-end' : ''}`}>
            {msg.senderId !== user.id && (
              <img src={users[msg.senderId]?.photo} alt={users[msg.senderId]?.name} className="h-8 w-8 rounded-full mr-2" />
            )}
            <div className={`p-2 max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${msg.senderId === user.id ? 'bg-blue text-white' : 'bg-light-blue text-black'}`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray mt-1">{formatDate(msg.timestamp)}</p>
            </div>
            {msg.senderId === user.id && (
              <img src={users[msg.senderId]?.photo} alt={users[msg.senderId]?.name} className="h-8 w-8 rounded-full ml-2" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-4 border-t border-gray-300">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 mr-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 text-white bg-blue rounded-lg hover:bg-blue hover:transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;