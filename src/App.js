import React from 'react';
import styled from 'styled-components';
import ChatWindow from './components/ChatWindow';
import FileViewer from './components/FileViewer';
import Terminal from './components/Terminal';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "chat file-viewer"
    "chat terminal";
  height: 100vh;
  width: 100vw;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
`;

const ChatContainer = styled.div`
  grid-area: chat;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
`;

const FileViewerContainer = styled.div`
  grid-area: file-viewer;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
`;

const TerminalContainer = styled.div`
  grid-area: terminal;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
`;

function App() {
  return (
    <AppContainer>
      <ChatContainer>
        <ChatWindow />
      </ChatContainer>
      <FileViewerContainer>
        <FileViewer />
      </FileViewerContainer>
      <TerminalContainer>
        <Terminal />
      </TerminalContainer>
    </AppContainer>
  );
}

export default App;