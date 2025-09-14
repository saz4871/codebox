import React, { useState } from 'react';
import './chat.css';

// Dummy data for users to simulate a search
const allUsers = [
  { id: 'user_1', name: 'Zeeshan' },
  { id: 'user_2', name: 'Ali' },
  { id: 'user_3', name: 'Fatima' },
  { id: 'user_4', name: 'Ahmed' },
  { id: 'user_5', name: 'Sara' },
];

// SVG icons for video and voice calls
const VideoCallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 11v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-4"/><polyline points="17 14 22 17 22 7 17 10"/></svg>
);

const VoiceCallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const Chat = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUsers, setSearchedUsers] = useState(allUsers);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSearch = () => {
    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedUsers(filteredUsers);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeChat) return;

    const newMsg = {
      text: newMessage,
      sender: 'me', // Assuming current user is 'me'
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate a response from the other user for demonstration
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, {
        text: "Got it!",
        sender: 'other',
        timestamp: new Date().toLocaleTimeString(),
      }]);
    }, 1000);
  };
  
  // New handlers for video and voice calls
  const handleVideoCall = () => {
      alert(`Starting video call with ${activeChat.name}...`);
      // Add logic for real-time video call here
  };
  
  const handleVoiceCall = () => {
      alert(`Starting voice call with ${activeChat.name}...`);
      // Add logic for real-time voice call here
  };

  return (
    <div className="chat-container">
      {/* Left Pane for User List and Search */}
      <div className="user-list-pane">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="user-list">
          <h3>Users</h3>
          {searchedUsers.length > 0 ? (
            searchedUsers.map(user => (
              <div
                key={user.id}
                className={`user-item ${activeChat && activeChat.id === user.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveChat(user);
                  // Reset messages for new chat for demonstration
                  setMessages([
                    { text: `Hi ${user.name}, how can I help?`, sender: 'other', timestamp: "10:00 AM" },
                  ]);
                }}
              >
                <h4>{user.name}</h4>
              </div>
            ))
          ) : (
            <p className="no-users-found">No users found.</p>
          )}
        </div>
      </div>

      {/* Right Pane for Chat Conversation */}
      <div className="chat-pane">
        {activeChat ? (
          <>
            <div className="chat-header">
              <h3>Chatting with: {activeChat.name}</h3>
              {/* Added buttons for video and voice calls */}
              <div className="call-buttons">
                <button onClick={handleVideoCall} title="Start Video Call">
                  <VideoCallIcon />
                </button>
                <button onClick={handleVoiceCall} title="Start Voice Call">
                  <VoiceCallIcon />
                </button>
              </div>
            </div>
            <div className="message-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  <p>{msg.text}</p>
                  <span className="message-timestamp">{msg.timestamp}</span>
                </div>
              ))}
            </div>
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Please select a user to start a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;