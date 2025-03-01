# Claude Web Interface

A web interface application with three panels for interacting with Claude:

- **Left Panel**: Chat interface for conversing with Claude
- **Upper Right Panel**: File viewer for browsing local repository files
- **Bottom Right Panel**: Terminal for running commands (gh, npm, etc.)

## Features

- Chat with Claude and request code-related tasks
- Browse files in the connected repository
- Execute terminal commands for testing, building code, etc.
- Integration with GitHub through gh CLI

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Application Structure

- `src/components/ChatWindow.js` - Claude chat interface
- `src/components/FileViewer.js` - File browser for repository
- `src/components/Terminal.js` - Terminal interface for commands

## Implementation Details

This application is implemented using:
- React.js for the UI
- styled-components for styling
- xterm.js for the terminal interface
- Connection to Claude API (to be implemented)

## Development Status

This is a work in progress. The UI components are set up but need to be connected to backend services:

- Chat component needs to be connected to Claude API
- File viewer needs to be connected to actual file system
- Terminal needs to execute real commands