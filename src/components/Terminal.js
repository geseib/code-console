import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { executeCommand } from '../services/terminalService';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TerminalContainer = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  overflow-y: auto;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  color: #f0f0f0;
  white-space: pre-wrap;
  word-break: break-all;
`;

const PromptLine = styled.div`
  display: flex;
  margin-top: 8px;
`;

const Prompt = styled.span`
  color: #4caf50;
  margin-right: 10px;
`;

const CurrentDir = styled.span`
  color: #2196f3;
  margin-right: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  color: #f0f0f0;
  font-family: monospace;
  font-size: 14px;
  width: 100%;
  outline: none;
  caret-color: #fff;
`;

const ClearButton = styled.button`
  background-color: transparent;
  border: 1px solid #666;
  color: #f0f0f0;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #333;
  }
`;

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to the simulated terminal!' },
    { type: 'output', content: 'Type "help" to see available commands.' }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount and when terminal is clicked
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Focus when component is mounted
    const terminalContainer = terminalRef.current;
    
    const handleTerminalClick = (e) => {
      // Only focus if the click was directly on the terminal container
      // or one of its children (not on another component)
      if (terminalRef.current && terminalRef.current.contains(e.target)) {
        e.preventDefault(); // Prevent default to maintain any text selection
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    if (terminalContainer) {
      terminalContainer.addEventListener('click', handleTerminalClick);
    }
    
    return () => {
      if (terminalContainer) {
        terminalContainer.removeEventListener('click', handleTerminalClick);
      }
    };
  }, []);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentCommand.trim() || isExecuting) return;
    
    const command = currentCommand.trim();
    
    // Add command to history
    setHistory(prev => [
      ...prev, 
      { 
        type: 'command',
        directory: currentDirectory,
        content: command
      }
    ]);
    
    setCurrentCommand('');
    setIsExecuting(true);
    
    try {
      // Execute command
      const result = await executeCommand(command, currentDirectory);
      
      if (result.output === 'CLEAR_TERMINAL') {
        // Special case for clear command
        setHistory([]);
      } else {
        // Add command output to history if not empty
        if (result.output) {
          setHistory(prev => [
            ...prev,
            { type: 'output', content: result.output }
          ]);
        }
        
        // Update current directory if changed
        if (result.newDirectory !== currentDirectory) {
          setCurrentDirectory(result.newDirectory);
        }
      }
    } catch (error) {
      // Add error to history
      setHistory(prev => [
        ...prev,
        { type: 'error', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <Container>
      <Header>
        <div>Terminal</div>
        <ClearButton onClick={handleClear}>Clear</ClearButton>
      </Header>
      <TerminalContainer ref={terminalRef}>
        {/* Render command history */}
        {history.map((item, index) => (
          <div key={index}>
            {item.type === 'command' ? (
              <PromptLine>
                <Prompt>user@claude:</Prompt>
                <CurrentDir>{item.directory ? `~/${item.directory}` : '~'}</CurrentDir>
                <span>$ {item.content}</span>
              </PromptLine>
            ) : item.type === 'error' ? (
              <div style={{ color: '#f44336' }}>{item.content}</div>
            ) : (
              <div>{item.content}</div>
            )}
          </div>
        ))}
        
        {/* Current prompt line */}
        <PromptLine>
          <Prompt>user@claude:</Prompt>
          <CurrentDir>{currentDirectory ? `~/${currentDirectory}` : '~'}</CurrentDir>
          <span>$&nbsp;</span>
          <InputContainer>
            <form onSubmit={handleCommandSubmit} style={{ width: '100%' }}>
              <Input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                disabled={isExecuting}
                autoFocus
              />
            </form>
          </InputContainer>
        </PromptLine>
      </TerminalContainer>
    </Container>
  );
};

export default Terminal;