/**
 * File System Service
 * 
 * This module provides functions to interact with the file system.
 * In a real application, these would make API calls to a backend service.
 * For this demo, we'll use simulated data based on the current project structure.
 */

// Import axios for HTTP requests
import axios from 'axios';

// Import virtualFileSystem from terminalService to share the same filesystem
import { getVirtualFileSystem } from './terminalService';

// Base directory for the file system
// In a real app, this would be configurable or set by the backend
const BASE_DIRECTORY = '/Users/georgeseib/Documents/projects/cc/third';

/**
 * List files and directories in a path
 * @param {string} path - Path relative to the base directory
 * @returns {Promise<Array>} - Array of file and directory objects
 */
export const listFiles = async (path = '') => {
  try {
    // In a real app, this would be an API call
    // For demo purposes, we'll return mock data based on the path
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For now, return structured mock data
    // Later we'll implement actual file system access
    const fullPath = path ? `${BASE_DIRECTORY}/${path}` : BASE_DIRECTORY;
    
    // This would be a real API call in production
    // const response = await axios.get('/api/files', { params: { path: fullPath } });
    // return response.data;
    
    // Get the virtual filesystem
    const vfs = getVirtualFileSystem();
    
    // Get all subdirectories directly under the specified path
    const directSubdirs = vfs.directories.filter(dir => {
      if (path === '') {
        // For root directory, get top-level dirs (no slashes)
        return dir !== '' && !dir.includes('/');
      } else {
        // For other directories, get direct children
        return dir !== path && 
              dir.startsWith(path + '/') && 
              dir.substring(path.length + 1).indexOf('/') === -1;
      }
    }).map(dir => {
      return {
        name: path === '' ? dir : dir.substring(path.length + 1),
        type: 'folder',
        path: dir
      };
    });
    
    // Get all files directly under the specified path
    const directFiles = Object.keys(vfs.files).filter(file => {
      if (path === '') {
        // For root directory, get top-level files (no slashes)
        return !file.includes('/');
      } else {
        // For other directories, get direct children
        return file.startsWith(path + '/') && 
              file.substring(path.length + 1).indexOf('/') === -1;
      }
    }).map(file => {
      return {
        name: path === '' ? file : file.substring(path.length + 1),
        type: 'file',
        path: file
      };
    });
    
    // Combine directories and files
    return [...directSubdirs, ...directFiles];
    
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
};

/**
 * Read file content
 * @param {string} path - Path to the file relative to the base directory
 * @returns {Promise<string>} - File content
 */
export const readFile = async (filePath) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const fullPath = `${BASE_DIRECTORY}/${filePath}`;
    
    // This would be a real API call in production
    // const response = await axios.get('/api/files/content', { params: { path: fullPath } });
    // return response.data;
    
    // Get the virtual filesystem
    const vfs = getVirtualFileSystem();
    
    // Check if file exists in the virtual filesystem
    if (filePath in vfs.files) {
      return vfs.files[filePath];
    }
    
    throw new Error(`File ${filePath} not found`);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read file');
  }
};

/**
 * Generate mock file list based on path
 * @param {string} fullPath - Full system path
 * @param {string} relativePath - Path relative to base directory
 * @returns {Array} - Array of file and directory objects
 */
function generateMockFileList(fullPath, relativePath) {
  // For demo purposes, we'll create a realistic file structure based on our project
  
  // Root directory
  if (!relativePath) {
    return [
      { name: 'public', type: 'folder', path: 'public' },
      { name: 'src', type: 'folder', path: 'src' },
      { name: 'package.json', type: 'file', path: 'package.json' },
      { name: 'README.md', type: 'file', path: 'README.md' },
      { name: 'node_modules', type: 'folder', path: 'node_modules' },
    ];
  }
  
  // src directory
  if (relativePath === 'src') {
    return [
      { name: 'components', type: 'folder', path: 'src/components' },
      { name: 'services', type: 'folder', path: 'src/services' },
      { name: 'App.js', type: 'file', path: 'src/App.js' },
      { name: 'index.js', type: 'file', path: 'src/index.js' },
      { name: 'index.css', type: 'file', path: 'src/index.css' },
    ];
  }
  
  // src/components directory
  if (relativePath === 'src/components') {
    return [
      { name: 'ChatWindow.js', type: 'file', path: 'src/components/ChatWindow.js' },
      { name: 'FileViewer.js', type: 'file', path: 'src/components/FileViewer.js' },
      { name: 'Terminal.js', type: 'file', path: 'src/components/Terminal.js' },
    ];
  }
  
  // src/services directory
  if (relativePath === 'src/services') {
    return [
      { name: 'fileService.js', type: 'file', path: 'src/services/fileService.js' },
    ];
  }
  
  // public directory
  if (relativePath === 'public') {
    return [
      { name: 'index.html', type: 'file', path: 'public/index.html' },
    ];
  }
  
  // Default - empty directory or unknown path
  return [];
}

/**
 * Get mock file content based on file path
 * @param {string} filePath - Path to the file
 * @returns {string} - File content
 */
function getMockFileContent(filePath) {
  const fileContents = {
    'package.json': `{
  "name": "third",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "description": "Web interface with Claude chat, file viewer, and terminal",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "^5.0.1",
    "styled-components": "^6.1.1",
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "axios": "^1.6.0"
  }
}`,
    'README.md': `# Claude Web Interface

A web interface application with three panels for interacting with Claude:

- **Left Panel**: Chat interface for conversing with Claude
- **Upper Right Panel**: File viewer for browsing local repository files
- **Bottom Right Panel**: Terminal for running commands (gh, npm, etc.)`,
    'src/App.js': `import React from 'react';
import styled from 'styled-components';
import ChatWindow from './components/ChatWindow';
import FileViewer from './components/FileViewer';
import Terminal from './components/Terminal';

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

export default App;`,
    'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Claude Web Interface</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
  };
  
  // Return the content if it exists, otherwise return a placeholder
  return fileContents[filePath] || `// Content for ${filePath} not available in demo`;
}

/**
 * Get a list of recently modified files
 * @returns {Promise<Array>} - Array of recent file objects
 */
export const getRecentFiles = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a mock list of recent files
  return [
    { name: 'FileViewer.js', type: 'file', path: 'src/components/FileViewer.js' },
    { name: 'App.js', type: 'file', path: 'src/App.js' },
    { name: 'index.js', type: 'file', path: 'src/index.js' },
    { name: 'package.json', type: 'file', path: 'package.json' },
  ];
};