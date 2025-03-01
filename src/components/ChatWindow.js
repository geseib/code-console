import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { sendMessageToClaude } from '../services/chatService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.isUser ? '#DCF8C6' : '#E5E5EA'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
  white-space: pre-wrap;
  
  & p {
    margin-top: 0;
  }
  
  & p:last-child {
    margin-bottom: 0;
  }
  
  & code {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 3px;
  }
  
  & pre {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    margin: 10px 0;
  }
  
  & pre code {
    background-color: transparent;
    padding: 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  min-height: 50px;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 0 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #3367d6;
  }
`;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the Claude API service
      const claudeResponse = await sendMessageToClaude(input);
      
      setMessages(prev => [...prev, { 
        text: claudeResponse,
        isUser: false 
      }]);
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error communicating with Claude.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      <Header>Claude Chat</Header>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.isUser}>
            {message.isUser ? (
              message.text
            ) : (
              <ReactMarkdown>
                {message.text}
              </ReactMarkdown>
            )}
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble isUser={false}>
            Claude is thinking...
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          Send
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatWindow;