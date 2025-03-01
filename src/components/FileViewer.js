import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { listFiles, readFile, getRecentFiles } from '../services/fileService';

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

const PathDisplay = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  padding-right: 10px;
`;

const RefreshButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const FileListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const FileItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const FolderIcon = styled.span`
  margin-right: 10px;
  color: #FFC107;
`;

const FileIcon = styled.span`
  margin-right: 10px;
  color: #4285f4;
`;

const FileContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  font-family: monospace;
  white-space: pre-wrap;
  border-top: 1px solid #ccc;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-style: italic;
  color: #666;
`;

const TabsContainer = styled.div`
  display: flex;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  background-color: ${props => props.active ? '#fff' : '#f0f0f0'};
  border-bottom: ${props => props.active ? '2px solid #4285f4' : 'none'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#fff' : '#e0e0e0'};
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 10px;
  margin: 10px;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  background-color: #ffebee;
`;

const FileViewer = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
  const [recentFiles, setRecentFiles] = useState([]);

  // Load files on component mount and when path changes
  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  // Load recent files on component mount
  useEffect(() => {
    if (activeTab === 'recent') {
      loadRecentFiles();
    }
  }, [activeTab]);

  const loadFiles = async (path) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileList = await listFiles(path);
      setFiles(fileList);
    } catch (err) {
      console.error('Failed to load files:', err);
      setError('Failed to load files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const recentFilesList = await getRecentFiles();
      setRecentFiles(recentFilesList);
    } catch (err) {
      console.error('Failed to load recent files:', err);
      setError('Failed to load recent files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFileContent = async (filePath) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await readFile(filePath);
      setFileContent(content);
    } catch (err) {
      console.error('Failed to load file content:', err);
      setError('Failed to load file content. Please try again.');
      setFileContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      // Navigate to folder
      setCurrentPath(file.path);
      setSelectedFile(null);
      setFileContent('');
    } else {
      // Load and display file content
      setSelectedFile(file);
      loadFileContent(file.path);
    }
  };

  const handleBackClick = () => {
    // Go up one directory
    if (currentPath.includes('/')) {
      const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      setCurrentPath(newPath);
    } else {
      setCurrentPath('');
    }
    setSelectedFile(null);
    setFileContent('');
  };

  const handleRefresh = () => {
    loadFiles(currentPath);
    if (selectedFile) {
      loadFileContent(selectedFile.path);
    }
  };

  const renderFileList = () => {
    if (isLoading && !selectedFile) {
      return <LoadingIndicator>Loading files...</LoadingIndicator>;
    }

    if (error && !selectedFile) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    const filesToDisplay = activeTab === 'files' ? files : recentFiles;

    return (
      <FileListContainer>
        {currentPath && activeTab === 'files' && (
          <FileItem onClick={handleBackClick}>
            <FolderIcon>📁</FolderIcon>..
          </FileItem>
        )}
        
        {filesToDisplay.map((item, index) => (
          <FileItem key={index} onClick={() => handleFileClick(item)}>
            {item.type === 'folder' ? (
              <>
                <FolderIcon>📁</FolderIcon>
                {item.name}
              </>
            ) : (
              <>
                <FileIcon>📄</FileIcon>
                {item.name}
              </>
            )}
          </FileItem>
        ))}
      </FileListContainer>
    );
  };

  return (
    <Container>
      <Header>
        <PathDisplay>
          {currentPath ? `/${currentPath}` : '/'}
        </PathDisplay>
        <RefreshButton onClick={handleRefresh}>
          Refresh
        </RefreshButton>
      </Header>

      <TabsContainer>
        <Tab 
          active={activeTab === 'files'} 
          onClick={() => setActiveTab('files')}
        >
          Files
        </Tab>
        <Tab 
          active={activeTab === 'recent'} 
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </Tab>
      </TabsContainer>
      
      {!selectedFile ? (
        renderFileList()
      ) : (
        <>
          <FileListContainer style={{ flex: '0 0 auto', maxHeight: '30%' }}>
            <FileItem onClick={() => {
              setSelectedFile(null);
              setFileContent('');
            }}>
              <FileIcon>↩️</FileIcon>
              Back to files
            </FileItem>
          </FileListContainer>
          {isLoading ? (
            <LoadingIndicator>Loading file content...</LoadingIndicator>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <FileContent>
              {fileContent}
            </FileContent>
          )}
        </>
      )}
    </Container>
  );
};

export default FileViewer;