/**
 * Terminal Service
 * 
 * This module provides functions to interact with a simulated shell.
 * In a real application, these would make API calls to a backend service.
 * For this demo, we'll simulate shell commands and responses.
 */

// Base directory for the file system - should match what's used in fileService
const BASE_DIRECTORY = '/Users/georgeseib/Documents/projects/cc/third';

// In-memory filesystem to track created/modified files and directories
// Export a getter function to allow other modules to access the filesystem
export const getVirtualFileSystem = () => virtualFileSystem;

const virtualFileSystem = {
  // Initial directories
  directories: [
    '',  // Root
    'src',
    'src/components',
    'src/services',
    'public',
    'node_modules'
  ],
  
  // Initial files with their content
  files: {
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
    'src/index.css': `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
    'src/components/ChatWindow.js': `import React from 'react';
import styled from 'styled-components';

// Chat window component implementation
export default function ChatWindow() {
  return <div>Chat Window</div>;
}`,
    'src/components/FileViewer.js': `import React from 'react';
import styled from 'styled-components';

// File viewer component implementation
export default function FileViewer() {
  return <div>File Viewer</div>;
}`,
    'src/components/Terminal.js': `import React from 'react';
import styled from 'styled-components';

// Terminal component implementation
export default function Terminal() {
  return <div>Terminal</div>;
}`,
    'src/services/fileService.js': `// File service implementation`,
    'src/services/terminalService.js': `// Terminal service implementation`,
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
  }
};

/**
 * Execute a shell command
 * @param {string} command - Command to execute
 * @param {string} currentDirectory - Current working directory
 * @returns {Promise<{output: string, newDirectory: string}>} - Command output and new working directory
 */
export const executeCommand = async (command, currentDirectory = '') => {
  // In a real implementation, this would call a backend API
  // For demo purposes, we'll simulate responses to common commands

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Trim command
  command = command.trim();

  // Determine the full path of the current directory
  const workingDir = currentDirectory || '';
  const fullPath = workingDir ? `${BASE_DIRECTORY}/${workingDir}` : BASE_DIRECTORY;

  // Check for redirection
  let redirectOutput = false;
  let redirectAppend = false;
  let redirectFile = '';
  let originalCommand = command;

  // Check for output redirection
  if (command.includes('>>')) {
    redirectOutput = true;
    redirectAppend = true;
    [command, redirectFile] = command.split('>>').map(part => part.trim());
  } else if (command.includes('>')) {
    redirectOutput = true;
    redirectAppend = false;
    [command, redirectFile] = command.split('>').map(part => part.trim());
  }

  // Parse command and arguments - handle quoted arguments properly
  const args = parseCommandArgs(command);
  const cmd = args.length > 0 ? args[0].toLowerCase() : '';

  // Track the new directory (changes if cd is used)
  let newDirectory = currentDirectory;

  // Simulate command execution
  let output = '';

  try {
    // Handle different commands
    switch (cmd) {
      // File system navigation
      case 'ls':
        output = simulateLS(args, workingDir);
        break;
      
      case 'cd':
        const cdResult = simulateCD(args, workingDir);
        output = cdResult.output;
        newDirectory = cdResult.newDirectory;
        break;
      
      case 'pwd':
        output = simulatePWD(workingDir);
        break;
      
      // File operations
      case 'cat':
        output = simulateCAT(args, workingDir);
        break;
      
      case 'touch':
        output = simulateTOUCH(args, workingDir);
        break;
      
      case 'mkdir':
        output = simulateMKDIR(args, workingDir);
        break;
      
      case 'rm':
        output = simulateRM(args, workingDir);
        break;
      
      case 'cp':
        output = simulateCP(args, workingDir);
        break;
      
      case 'mv':
        output = simulateMV(args, workingDir);
        break;
      
      case 'find':
        output = simulateFIND(args, workingDir);
        break;
      
      case 'grep':
        output = simulateGREP(args, workingDir);
        break;
      
      // Text output
      case 'echo':
        output = simulateECHO(args);
        break;
      
      // External tools
      case 'npm':
        output = simulateNPM(args, workingDir);
        break;
      
      case 'node':
        output = simulateNODE(args, workingDir);
        break;
      
      case 'gh':
        output = simulateGH(args, workingDir);
        break;
      
      case 'git':
        output = simulateGit(args, workingDir);
        break;
      
      // System commands
      case 'ps':
        output = simulatePS(args);
        break;
      
      case 'whoami':
        output = 'user';
        break;
      
      case 'date':
        output = new Date().toString();
        break;
      
      case 'help':
        output = getHelpText();
        break;
      
      case 'man':
        output = simulateMAN(args);
        break;
      
      case 'clear':
        // The clear command returns a special signal to clear the terminal
        return { output: 'CLEAR_TERMINAL', newDirectory };
      
      case '':
        // Empty command, do nothing
        output = '';
        break;
      
      default:
        // Check if this is an executable file in the current directory
        if (fileExists(`${workingDir ? workingDir + '/' : ''}${cmd}`)) {
          output = `Simulated execution of ${cmd}`;
        } else {
          output = `Command not found: ${cmd}\nType 'help' to see available commands.`;
        }
    }
  } catch (error) {
    output = `Error: ${error.message}`;
  }

  // Handle output redirection if needed
  if (redirectOutput && output) {
    try {
      const filePath = resolveFilePath(redirectFile, workingDir);
      
      // Check if parent directory exists
      const parentDir = filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/')) : '';
      
      if (parentDir && !directoryExists(parentDir)) {
        output = `${cmd}: cannot create ${redirectFile}: No such file or directory`;
      } else {
        // If appending, get existing content (if file exists)
        let newContent = output;
        if (redirectAppend && fileExists(filePath)) {
          newContent = virtualFileSystem.files[filePath] + '\n' + output;
        }
        
        // Create or overwrite the file
        createFile(filePath, newContent);
        
        // Clear output since it's been redirected to a file
        output = '';
      }
    } catch (error) {
      output = `Error redirecting output: ${error.message}`;
    }
  }

  return { output, newDirectory };
};

/**
 * Simulate the 'ls' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateLS(args, workingDir) {
  // Check for -l flag
  const isLongFormat = args.includes('-l');
  
  // Get mock file listing based on the current directory
  const files = getMockFileListing(workingDir);
  
  if (isLongFormat) {
    // Format like a real ls -l command
    return files.map(file => {
      const isDir = file.type === 'folder';
      const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
      const size = isDir ? 4096 : Math.floor(Math.random() * 10000);
      const date = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${permissions} 1 user group ${size.toString().padStart(6)} ${date} ${file.name}${isDir ? '/' : ''}`;
    }).join('\n');
  } else {
    // Simple format
    return files.map(file => {
      return file.type === 'folder' ? `${file.name}/` : file.name;
    }).join('  ');
  }
}

/**
 * Simulate the 'cd' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {{output: string, newDirectory: string}} - Command output and new working directory
 */
function simulateCD(args, workingDir) {
  if (args.length < 2) {
    // cd without arguments goes to home directory
    return { output: '', newDirectory: '' };
  }
  
  const target = args[1];
  
  if (target === '..') {
    // Go up one directory
    if (!workingDir || !workingDir.includes('/')) {
      return { output: '', newDirectory: '' };
    }
    
    const newDir = workingDir.substring(0, workingDir.lastIndexOf('/'));
    return { output: '', newDirectory: newDir };
  }
  
  if (target === '.') {
    // Stay in current directory
    return { output: '', newDirectory: workingDir };
  }
  
  if (target.startsWith('/')) {
    // Absolute path (within our mock filesystem)
    const newDir = target.substring(1); // Remove leading slash
    
    // Check if directory exists
    if (directoryExists(newDir)) {
      return { output: '', newDirectory: newDir };
    } else {
      return { 
        output: `cd: ${target}: No such file or directory`, 
        newDirectory: workingDir 
      };
    }
  }
  
  // Relative path
  const newDir = workingDir ? `${workingDir}/${target}` : target;
  
  // Check if directory exists
  if (directoryExists(newDir)) {
    return { output: '', newDirectory: newDir };
  } else {
    return { 
      output: `cd: ${target}: No such file or directory`, 
      newDirectory: workingDir 
    };
  }
}

/**
 * Simulate the 'pwd' command
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulatePWD(workingDir) {
  return workingDir ? `/${workingDir}` : '/';
}

/**
 * Simulate the 'cat' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateCAT(args, workingDir) {
  if (args.length < 2) {
    return 'cat: missing file operand';
  }
  
  const filename = args[1];
  const path = resolveFilePath(filename, workingDir);
  
  // Check if file exists
  if (fileExists(path)) {
    return getMockFileContent(path);
  } else {
    return `cat: ${filename}: No such file or directory`;
  }
}

/**
 * Simulate the 'mkdir' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateMKDIR(args, workingDir) {
  if (args.length < 2) {
    return 'mkdir: missing operand';
  }
  
  // Check for -p flag (create parent directories as needed)
  const createParents = args.includes('-p');
  
  // Get targets (ignore option flags)
  const targets = args.slice(1).filter(arg => !arg.startsWith('-'));
  
  if (targets.length === 0) {
    return 'mkdir: missing operand';
  }
  
  for (const target of targets) {
    const path = resolveFilePath(target, workingDir);
    
    // Check if directory already exists
    if (directoryExists(path)) {
      if (!createParents) {
        return `mkdir: cannot create directory '${target}': File exists`;
      }
      // With -p, we just continue if the directory exists
      continue;
    }
    
    // Check if a file with the same name exists
    if (fileExists(path)) {
      return `mkdir: cannot create directory '${target}': File exists`;
    }
    
    // Check if parent directory exists
    const parentDir = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
    
    if (parentDir && !directoryExists(parentDir)) {
      if (createParents) {
        // Create parent directories recursively
        const parts = path.split('/');
        let currentPath = '';
        
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === '') continue;
          
          if (currentPath === '') {
            currentPath = parts[i];
          } else {
            currentPath += '/' + parts[i];
          }
          
          if (!directoryExists(currentPath)) {
            createDirectory(currentPath);
          }
        }
      } else {
        return `mkdir: cannot create directory '${target}': No such file or directory`;
      }
    } else {
      // Create the directory
      createDirectory(path);
    }
  }
  
  return '';
}

/**
 * Simulate the 'npm' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateNPM(args, workingDir) {
  if (args.length < 2) {
    return 'npm: missing command';
  }
  
  const subCommand = args[1];
  
  switch (subCommand) {
    case 'start':
      return 'Starting development server...\n\nCompiled successfully!\n\nYou can now view the app in the browser.\n\n  Local:            http://localhost:3000\n  On Your Network:  http://192.168.0.45:3000';
    
    case 'test':
      return 'PASS  src/__tests__/app.test.js\nPASS  src/__tests__/components.test.js\n\nTest Suites: 2 passed, 2 total\nTests:       7 passed, 7 total\nSnapshots:   0 total\nTime:        1.234s';
    
    case 'build':
      return 'Creating an optimized production build...\nCompiled successfully.\n\nFile sizes after gzip:\n\n  142.32 KB  build/static/js/main.a1b2c3d4.js\n  23.45 KB   build/static/css/main.a1b2c3d4.css';
    
    case 'install':
      const packageName = args.length > 2 ? args[2] : '';
      if (packageName) {
        return `+ ${packageName}@1.2.3\nadded 42 packages from 23 contributors in 2.5s`;
      } else {
        return 'added 1344 packages in 30s';
      }
    
    default:
      return `Unknown npm command: ${subCommand}`;
  }
}

/**
 * Simulate the 'gh' (GitHub CLI) command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateGH(args, workingDir) {
  if (args.length < 2) {
    return 'gh: missing command';
  }
  
  const subCommand = args[1];
  
  switch (subCommand) {
    case 'pr':
      if (args.length < 3) {
        return 'gh pr: missing subcommand';
      }
      
      const prSubCommand = args[2];
      
      switch (prSubCommand) {
        case 'list':
          return 'Showing 2 of 2 open pull requests in username/repo\n\n#42  Update documentation  user1  [feature/docs]  1d\n#41  Fix terminal component  user2  [bugfix/terminal]  2d';
        
        case 'create':
          return 'Creating pull request for feature-branch into main in username/repo\n\nPull request created: https://github.com/username/repo/pull/43';
        
        default:
          return `Unknown gh pr command: ${prSubCommand}`;
      }
    
    case 'issue':
      return 'Showing 3 of 3 open issues in username/repo\n\n#39  Improve performance  user1  2d\n#38  Add test coverage  user2  3d\n#37  Update dependencies  user3  1w';
    
    default:
      return `Unknown gh command: ${subCommand}`;
  }
}

/**
 * Simulate the 'git' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateGit(args, workingDir) {
  if (args.length < 2) {
    return 'git: missing command';
  }
  
  const subCommand = args[1];
  
  switch (subCommand) {
    case 'status':
      return 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n        modified:   src/components/Terminal.js\n        modified:   src/components/FileViewer.js\n\nno changes added to commit (use "git add" and/or "git commit -a")';
    
    case 'add':
      return '';
    
    case 'commit':
      return '[main a1b2c3d] Update terminal and file viewer components\n 2 files changed, 150 insertions(+), 20 deletions(-)';
    
    case 'push':
      return 'Enumerating objects: 7, done.\nCounting objects: 100% (7/7), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (4/4), done.\nWriting objects: 100% (4/4), 1.23 KiB | 1.23 MiB/s, done.\nTotal 4 (delta 3), reused 0 (delta 0), pack-reused 0\nremote: Resolving deltas: 100% (3/3), completed with 3 local objects.\nTo github.com:username/repo.git\n   a1b2c3d..e4f5g6h  main -> main';
    
    case 'log':
      return 'commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t\nAuthor: User <user@example.com>\nDate:   Mon Mar 1 12:34:56 2024 -0800\n\n    Update terminal and file viewer components\n\ncommit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0\nAuthor: User <user@example.com>\nDate:   Sun Feb 29 12:34:56 2024 -0800\n\n    Initial commit';
    
    case 'branch':
      return '* main\n  feature/file-viewer\n  feature/terminal';
    
    case 'checkout':
      const branchName = args.length > 2 ? args[2] : 'main';
      return `Switched to branch '${branchName}'`;
    
    default:
      return `Unknown git command: ${subCommand}`;
  }
}

/**
 * Get help text for available commands
 * @returns {string} - Help text
 */
/**
 * Parse command arguments, handling quoted strings correctly
 * @param {string} commandLine - Command line to parse
 * @returns {string[]} - Array of parsed arguments
 */
function parseCommandArgs(commandLine) {
  const args = [];
  let currentArg = '';
  let inQuote = false;
  let quoteChar = '';
  
  for (let i = 0; i < commandLine.length; i++) {
    const char = commandLine[i];
    
    if ((char === '"' || char === "'") && (!inQuote || quoteChar === char)) {
      if (inQuote) {
        inQuote = false;
        quoteChar = '';
      } else {
        inQuote = true;
        quoteChar = char;
      }
      continue;
    }
    
    if (char === ' ' && !inQuote) {
      if (currentArg) {
        args.push(currentArg);
        currentArg = '';
      }
      continue;
    }
    
    currentArg += char;
  }
  
  if (currentArg) {
    args.push(currentArg);
  }
  
  return args;
}

/**
 * Simulate the 'echo' command
 * @param {string[]} args - Command arguments
 * @returns {string} - Command output
 */
function simulateECHO(args) {
  // Skip the 'echo' command itself
  return args.slice(1).join(' ');
}

/**
 * Simulate the 'touch' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateTOUCH(args, workingDir) {
  if (args.length < 2) {
    return 'touch: missing file operand';
  }
  
  // Get all file operands (skipping the command itself)
  const files = args.slice(1);
  
  for (const file of files) {
    const path = resolveFilePath(file, workingDir);
    
    // Check if parent directory exists
    const parentDir = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
    
    if (parentDir && !directoryExists(parentDir)) {
      return `touch: cannot touch '${file}': No such file or directory`;
    }
    
    // Create the file if it doesn't exist
    if (!fileExists(path)) {
      createFile(path, '');
    } else {
      // In a real touch, this would update the timestamp
      // We'll just do nothing for existing files
    }
  }
  
  return '';
}

/**
 * Simulate the 'rm' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateRM(args, workingDir) {
  if (args.length < 2) {
    return 'rm: missing operand';
  }
  
  const isRecursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
  const isForce = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
  
  // Get targets (ignore option flags)
  const targets = args.slice(1).filter(arg => !arg.startsWith('-'));
  
  if (targets.length === 0) {
    return 'rm: missing operand';
  }
  
  for (const target of targets) {
    const path = resolveFilePath(target, workingDir);
    
    if (fileExists(path)) {
      // Remove file
      removeFile(path);
    } else if (directoryExists(path)) {
      // Remove directory
      if (!isRecursive) {
        return `rm: cannot remove '${target}': Is a directory`;
      } else {
        removeDirectory(path, true);
      }
    } else if (!isForce) {
      return `rm: cannot remove '${target}': No such file or directory`;
    }
  }
  
  return '';
}

/**
 * Simulate the 'cp' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateCP(args, workingDir) {
  if (args.length < 3) {
    return 'cp: missing file operand';
  }
  
  const isRecursive = args.includes('-r') || args.includes('-R');
  
  // Get all arguments that aren't flags
  const nonFlagArgs = args.filter(arg => !arg.startsWith('-'));
  
  // Need at least a source and destination
  if (nonFlagArgs.length < 3) {
    return 'cp: missing destination file operand after ' + nonFlagArgs[1];
  }
  
  // Last argument is the destination
  const destination = resolveFilePath(nonFlagArgs[nonFlagArgs.length - 1], workingDir);
  
  // All other non-flag arguments except the command itself are sources
  const sources = nonFlagArgs.slice(1, nonFlagArgs.length - 1).map(src => 
    resolveFilePath(src, workingDir)
  );
  
  // If copying multiple sources, destination must be a directory
  if (sources.length > 1 && !directoryExists(destination)) {
    return `cp: target '${nonFlagArgs[nonFlagArgs.length - 1]}' is not a directory`;
  }
  
  for (const source of sources) {
    if (fileExists(source)) {
      // Copying a file
      
      // Determine the destination path
      let destPath = destination;
      if (directoryExists(destination)) {
        // If destination is a directory, copy into it with the same name
        const fileName = source.includes('/') ? source.substring(source.lastIndexOf('/') + 1) : source;
        destPath = destination + '/' + fileName;
      }
      
      // Copy the file content
      createFile(destPath, virtualFileSystem.files[source]);
      
    } else if (directoryExists(source)) {
      // Copying a directory
      
      if (!isRecursive) {
        return `cp: -r not specified; omitting directory '${source}'`;
      }
      
      // Determine the destination directory path
      let destDirPath = destination;
      if (directoryExists(destination)) {
        // If destination already exists as a directory, create a subdirectory
        const dirName = source.includes('/') ? source.substring(source.lastIndexOf('/') + 1) : source;
        destDirPath = destination + '/' + dirName;
        
        // Create the destination directory if it doesn't exist
        if (!directoryExists(destDirPath)) {
          createDirectory(destDirPath);
        }
      } else {
        // Create the destination directory
        createDirectory(destDirPath);
      }
      
      // Copy all files and subdirectories recursively
      // Find all subdirectories
      const subdirs = virtualFileSystem.directories.filter(dir => 
        dir !== source && dir.startsWith(source + '/')
      );
      
      // Create all subdirectories in the destination
      for (const subdir of subdirs) {
        const relativePath = subdir.substring(source.length);
        createDirectory(destDirPath + relativePath);
      }
      
      // Copy all files
      const filesInDir = Object.keys(virtualFileSystem.files).filter(file => 
        file.startsWith(source + '/')
      );
      
      for (const file of filesInDir) {
        const relativePath = file.substring(source.length);
        createFile(destDirPath + relativePath, virtualFileSystem.files[file]);
      }
      
    } else {
      return `cp: cannot stat '${nonFlagArgs[sources.indexOf(source) + 1]}': No such file or directory`;
    }
  }
  
  return '';
}

/**
 * Simulate the 'mv' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateMV(args, workingDir) {
  if (args.length < 3) {
    return 'mv: missing file operand';
  }
  
  // Get all arguments except the command itself
  const nonFlagArgs = args.filter(arg => !arg.startsWith('-'));
  
  // Need at least a source and destination
  if (nonFlagArgs.length < 3) {
    return 'mv: missing destination file operand after ' + nonFlagArgs[1];
  }
  
  // Last argument is the destination
  const destination = resolveFilePath(nonFlagArgs[nonFlagArgs.length - 1], workingDir);
  
  // All other non-flag arguments except the command itself are sources
  const sources = nonFlagArgs.slice(1, nonFlagArgs.length - 1).map(src => 
    resolveFilePath(src, workingDir)
  );
  
  // If moving multiple sources, destination must be a directory
  if (sources.length > 1 && !directoryExists(destination)) {
    return `mv: target '${nonFlagArgs[nonFlagArgs.length - 1]}' is not a directory`;
  }
  
  for (const source of sources) {
    if (fileExists(source)) {
      // Moving a file
      
      // Determine the destination path
      let destPath = destination;
      if (directoryExists(destination)) {
        // If destination is a directory, move into it with the same name
        const fileName = source.includes('/') ? source.substring(source.lastIndexOf('/') + 1) : source;
        destPath = destination + '/' + fileName;
      }
      
      // Move the file (copy then delete)
      createFile(destPath, virtualFileSystem.files[source]);
      removeFile(source);
      
    } else if (directoryExists(source)) {
      // Moving a directory
      
      // Determine the destination directory path
      let destDirPath = destination;
      if (directoryExists(destination)) {
        // If destination already exists as a directory, create a subdirectory
        const dirName = source.includes('/') ? source.substring(source.lastIndexOf('/') + 1) : source;
        destDirPath = destination + '/' + dirName;
        
        // Create the destination directory if it doesn't exist
        if (!directoryExists(destDirPath)) {
          createDirectory(destDirPath);
        }
      } else {
        // Create the destination directory
        createDirectory(destDirPath);
      }
      
      // Move all files and subdirectories
      // Find all subdirectories
      const subdirs = virtualFileSystem.directories.filter(dir => 
        dir !== source && dir.startsWith(source + '/')
      );
      
      // Create all subdirectories in the destination
      for (const subdir of subdirs) {
        const relativePath = subdir.substring(source.length);
        createDirectory(destDirPath + relativePath);
      }
      
      // Move all files
      const filesInDir = Object.keys(virtualFileSystem.files).filter(file => 
        file.startsWith(source + '/')
      );
      
      for (const file of filesInDir) {
        const relativePath = file.substring(source.length);
        createFile(destDirPath + relativePath, virtualFileSystem.files[file]);
        removeFile(file);
      }
      
      // Remove the source directory and all subdirectories
      for (const subdir of [...subdirs].reverse()) {
        removeDirectory(subdir);
      }
      removeDirectory(source);
      
    } else {
      return `mv: cannot stat '${nonFlagArgs[sources.indexOf(source) + 1]}': No such file or directory`;
    }
  }
  
  return '';
}

/**
 * Simulate the 'find' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateFIND(args, workingDir) {
  // Basic implementation of find
  // find [path] -name "pattern"
  
  let path = '.';
  let pattern = null;
  
  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '-name' && i + 1 < args.length) {
      pattern = args[i + 1];
      i++; // Skip the next argument
    } else if (!args[i].startsWith('-') && i === 1) {
      path = args[i];
    }
  }
  
  if (!pattern) {
    return 'find: missing arguments';
  }
  
  // Remove quotes if present
  pattern = pattern.replace(/^['"]|['"]$/g, '');
  
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  // Get file listing for the path
  const searchPath = path === '.' ? workingDir : resolveFilePath(path, workingDir);
  
  // In a real implementation, this would search for files
  // For our demo, we'll return a simulated result
  
  // Create a reasonable list of matches based on the pattern
  const matches = [];
  const files = getMockFileListing(searchPath);
  
  for (const file of files) {
    if (regex.test(file.name)) {
      matches.push(`${searchPath ? searchPath + '/' : ''}${file.name}`);
    }
  }
  
  return matches.length > 0 ? matches.join('\n') : '';
}

/**
 * Simulate the 'grep' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateGREP(args, workingDir) {
  if (args.length < 3) {
    return 'grep: missing pattern';
  }
  
  const pattern = args[1];
  const filePaths = args.slice(2);
  
  // In a real implementation, this would search file contents
  // For our demo, we'll return simulated results
  
  const results = [];
  
  for (const filePath of filePaths) {
    const path = resolveFilePath(filePath, workingDir);
    
    if (fileExists(path)) {
      const content = getMockFileContent(path);
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern)) {
          results.push(`${filePath}:${i + 1}: ${lines[i]}`);
        }
      }
    } else {
      results.push(`grep: ${filePath}: No such file or directory`);
    }
  }
  
  return results.join('\n');
}

/**
 * Simulate the 'ps' command
 * @param {string[]} args - Command arguments
 * @returns {string} - Command output
 */
function simulatePS(args) {
  const header = '  PID TTY          TIME CMD';
  const processes = [
    ' 1234 pts/0    00:00:01 bash',
    ' 5678 pts/0    00:00:00 npm',
    ' 9012 pts/0    00:00:12 node',
    '13456 pts/0    00:00:00 ps'
  ];
  
  return [header, ...processes].join('\n');
}

/**
 * Simulate the 'node' command
 * @param {string[]} args - Command arguments
 * @param {string} workingDir - Current working directory
 * @returns {string} - Command output
 */
function simulateNODE(args, workingDir) {
  if (args.length === 1) {
    return 'Welcome to Node.js v18.16.0.\nType ".help" for more information.';
  }
  
  const scriptPath = args[1];
  const path = resolveFilePath(scriptPath, workingDir);
  
  if (fileExists(path)) {
    return `Simulated execution of Node.js script: ${scriptPath}`;
  } else {
    return `Error: Cannot find module '${scriptPath}'`;
  }
}

/**
 * Simulate the 'man' command
 * @param {string[]} args - Command arguments
 * @returns {string} - Command output
 */
function simulateMAN(args) {
  if (args.length < 2) {
    return 'What manual page do you want?';
  }
  
  const command = args[1];
  
  const manPages = {
    'ls': 'LS(1)                    User Commands                   LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nDESCRIPTION\n       List information about the FILEs (the current directory by default).',
    'cd': 'CD(1)                    User Commands                   CD(1)\n\nNAME\n       cd - change directory\n\nSYNOPSIS\n       cd [directory]\n\nDESCRIPTION\n       Change the current directory to the specified directory.',
    'cat': 'CAT(1)                  User Commands                   CAT(1)\n\nNAME\n       cat - concatenate files and print on the standard output\n\nSYNOPSIS\n       cat [OPTION]... [FILE]...\n\nDESCRIPTION\n       Concatenate FILE(s) to standard output.',
    'mkdir': 'MKDIR(1)               User Commands                 MKDIR(1)\n\nNAME\n       mkdir - make directories\n\nSYNOPSIS\n       mkdir [OPTION]... DIRECTORY...\n\nDESCRIPTION\n       Create the DIRECTORY(ies), if they do not already exist.',
    'touch': 'TOUCH(1)               User Commands                 TOUCH(1)\n\nNAME\n       touch - change file timestamps\n\nSYNOPSIS\n       touch [OPTION]... FILE...\n\nDESCRIPTION\n       Update the access and modification times of each FILE to the current time.',
    'rm': 'RM(1)                    User Commands                   RM(1)\n\nNAME\n       rm - remove files or directories\n\nSYNOPSIS\n       rm [OPTION]... [FILE]...\n\nDESCRIPTION\n       Remove (unlink) the FILE(s).',
    'cp': 'CP(1)                    User Commands                   CP(1)\n\nNAME\n       cp - copy files and directories\n\nSYNOPSIS\n       cp [OPTION]... SOURCE DEST\n\nDESCRIPTION\n       Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.',
    'mv': 'MV(1)                    User Commands                   MV(1)\n\nNAME\n       mv - move (rename) files\n\nSYNOPSIS\n       mv [OPTION]... SOURCE DEST\n\nDESCRIPTION\n       Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.',
    'find': 'FIND(1)                  User Commands                 FIND(1)\n\nNAME\n       find - search for files in a directory hierarchy\n\nSYNOPSIS\n       find [path...] [expression]\n\nDESCRIPTION\n       Search for files in a directory hierarchy.',
    'grep': 'GREP(1)                  User Commands                 GREP(1)\n\nNAME\n       grep - print lines that match patterns\n\nSYNOPSIS\n       grep [OPTION...] PATTERNS [FILE...]\n\nDESCRIPTION\n       Search for PATTERNS in each FILE.',
    'echo': 'ECHO(1)                  User Commands                 ECHO(1)\n\nNAME\n       echo - display a line of text\n\nSYNOPSIS\n       echo [SHORT-OPTION]... [STRING]...\n\nDESCRIPTION\n       Echo the STRING(s) to standard output.',
    'pwd': 'PWD(1)                   User Commands                  PWD(1)\n\nNAME\n       pwd - print name of current/working directory\n\nSYNOPSIS\n       pwd [OPTION]...\n\nDESCRIPTION\n       Print the full filename of the current working directory.',
  };
  
  return manPages[command] || `No manual entry for ${command}`;
}

function getHelpText() {
  return `
Available commands:

File Operations:
  ls [options]           List directory contents
  cd <directory>         Change directory
  pwd                    Print working directory
  touch <file>           Create an empty file
  mkdir <directory>      Create directory
  rm [-rf] <file/dir>    Remove files or directories
  cp [-r] <src> <dst>    Copy files or directories
  mv <src> <dst>         Move/rename files or directories
  cat <file>             Display file contents
  find <path> -name <p>  Search for files
  grep <pattern> <file>  Search for a pattern in files

Git Commands:
  git status             Show git status
  git add <file>         Stage changes
  git commit -m <msg>    Commit changes
  git push               Push changes
  git log                Show commit history
  git branch             List branches
  git checkout <branch>  Switch branches
  
npm Commands:
  npm start              Start development server
  npm test               Run tests
  npm build              Build for production
  npm install [pkg]      Install dependencies
  
GitHub CLI:
  gh pr list             List pull requests
  gh pr create           Create pull request
  gh issue               List issues
  
System Commands:
  echo <text>            Display a line of text
  date                   Show the current date and time
  ps                     Report process status
  whoami                 Print current user
  man <command>          Display manual page
  clear                  Clear the terminal screen
  help                   Show this help
`.trim();
}

/**
 * Check if a directory exists in our virtual filesystem
 * @param {string} path - Directory path
 * @returns {boolean} - True if directory exists
 */
function directoryExists(path) {
  return virtualFileSystem.directories.includes(path);
}

/**
 * Create a directory in our virtual filesystem
 * @param {string} path - Directory path
 * @returns {boolean} - True if directory was created successfully
 */
function createDirectory(path) {
  if (directoryExists(path)) {
    return false; // Directory already exists
  }
  
  // Add directory to virtual filesystem
  virtualFileSystem.directories.push(path);
  return true;
}

/**
 * Check if a file exists in our virtual filesystem
 * @param {string} path - File path
 * @returns {boolean} - True if file exists
 */
function fileExists(path) {
  return path in virtualFileSystem.files;
}

/**
 * Create a file in our virtual filesystem
 * @param {string} path - File path
 * @param {string} content - File content
 * @returns {boolean} - True if file was created successfully
 */
function createFile(path, content = '') {
  if (fileExists(path)) {
    return false; // File already exists
  }
  
  // Add file to virtual filesystem
  virtualFileSystem.files[path] = content;
  return true;
}

/**
 * Remove a file from our virtual filesystem
 * @param {string} path - File path
 * @returns {boolean} - True if file was removed successfully
 */
function removeFile(path) {
  if (!fileExists(path)) {
    return false; // File doesn't exist
  }
  
  // Remove file from virtual filesystem
  delete virtualFileSystem.files[path];
  return true;
}

/**
 * Remove a directory from our virtual filesystem
 * @param {string} path - Directory path
 * @param {boolean} recursive - Whether to remove subdirectories and files
 * @returns {boolean} - True if directory was removed successfully
 */
function removeDirectory(path, recursive = false) {
  if (!directoryExists(path)) {
    return false; // Directory doesn't exist
  }
  
  // Check if directory is empty or recursive flag is set
  const filesInDir = Object.keys(virtualFileSystem.files).filter(file => 
    file.startsWith(path + '/') || file === path
  );
  
  const dirsInDir = virtualFileSystem.directories.filter(dir => 
    dir !== path && dir.startsWith(path + '/')
  );
  
  if ((filesInDir.length > 0 || dirsInDir.length > 0) && !recursive) {
    return false; // Directory not empty and recursive flag not set
  }
  
  // Remove files in directory if recursive
  if (recursive) {
    filesInDir.forEach(file => {
      delete virtualFileSystem.files[file];
    });
    
    // Remove subdirectories
    virtualFileSystem.directories = virtualFileSystem.directories.filter(dir => 
      dir !== path && !dir.startsWith(path + '/')
    );
  } else {
    // Just remove the directory
    virtualFileSystem.directories = virtualFileSystem.directories.filter(dir => 
      dir !== path
    );
  }
  
  return true;
}

/**
 * Resolve a file path based on the current working directory
 * @param {string} filename - File name or path
 * @param {string} workingDir - Current working directory
 * @returns {string} - Resolved file path
 */
function resolveFilePath(filename, workingDir) {
  if (filename.startsWith('/')) {
    // Absolute path (within our mock filesystem)
    return filename.substring(1); // Remove leading slash
  } else {
    // Relative path
    return workingDir ? `${workingDir}/${filename}` : filename;
  }
}

// Removed previous implementation

/**
 * Get file content from our virtual filesystem
 * @param {string} filePath - Path to the file
 * @returns {string} - File content
 */
function getMockFileContent(filePath) {
  // Return the file content from the virtual filesystem
  if (fileExists(filePath)) {
    return virtualFileSystem.files[filePath];
  }
  
  return `// File ${filePath} not found`;
}

/**
 * Get mock file listing based on directory
 * @param {string} directory - Directory path
 * @returns {Array} - Array of file and directory objects
 */
function getMockFileListing(directory) {
  // Get all subdirectories directly under the specified directory
  const directSubdirs = virtualFileSystem.directories.filter(dir => {
    if (directory === '') {
      // For root directory, get top-level dirs (no slashes)
      return dir !== '' && !dir.includes('/');
    } else {
      // For other directories, get direct children
      return dir !== directory && 
             dir.startsWith(directory + '/') && 
             dir.substring(directory.length + 1).indexOf('/') === -1;
    }
  }).map(dir => {
    return {
      name: directory === '' ? dir : dir.substring(directory.length + 1),
      type: 'folder'
    };
  });
  
  // Get all files directly under the specified directory
  const directFiles = Object.keys(virtualFileSystem.files).filter(file => {
    if (directory === '') {
      // For root directory, get top-level files (no slashes)
      return !file.includes('/');
    } else {
      // For other directories, get direct children
      return file.startsWith(directory + '/') && 
             file.substring(directory.length + 1).indexOf('/') === -1;
    }
  }).map(file => {
    return {
      name: directory === '' ? file : file.substring(directory.length + 1),
      type: 'file'
    };
  });
  
  // Combine directories and files
  return [...directSubdirs, ...directFiles];
}