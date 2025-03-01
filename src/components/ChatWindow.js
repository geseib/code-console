import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

    // Mock API call to Claude
    // In a real implementation, you would call your Claude API endpoint
    try {
      // Replace with actual Claude API call
      setTimeout(() => {
        const claudeResponse = {
          text: "This is a mock response from Claude. In a real implementation, this would be the response from the actual Claude API.",
          isUser: false,
        };
        
        setMessages(prev => [...prev, claudeResponse]);
        setIsLoading(false);
      }, 1000);
      
      // Example of how the actual API call might look:
      // const response = await axios.post('/api/claude', { message: input });
      // setMessages(prev => [...prev, { text: response.data.message, isUser: false }]);
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error communicating with Claude.", 
        isUser: false 
      }]);
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
            {message.text}
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble isUser={false}>
            Claude is typing...
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