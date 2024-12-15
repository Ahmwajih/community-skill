'use client';
import React from "react";

interface MessageProps {
  text: string;
  sender: string; // Can be 'me' or 'other'
}

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <div className={`message ${sender === 'me' ? 'message-sent' : 'message-received'}`}>
      <p>{text}</p>
      <style jsx>{`
        .message {
          max-width: 60%;
          padding: 10px;
          border-radius: 10px;
          margin: 5px;
          word-wrap: break-word;
        }
        .message-sent {
          background-color: #007bff;
          color: white;
          align-self: flex-end;
        }
        .message-received {
          background-color: #f1f1f1;
          color: black;
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
};

export default Message;