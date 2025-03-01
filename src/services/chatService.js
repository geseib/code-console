/**
 * Chat Service
 * 
 * This module provides functions to interact with the Claude API.
 * In a real application, these would make API calls to a backend service.
 * For this demo, we'll simulate responses from Claude.
 */

import axios from 'axios';

// Sample responses for demonstration purposes
const sampleResponses = [
  "I'd be happy to help with that. Let me think about it...",
  "That's an interesting question. Here's what I can tell you about it...",
  "I can help you with that code. Let's break it down step by step...",
  "Based on what you've described, here's a possible solution...",
  "To accomplish this task, you'll want to consider the following approaches...",
  "From what I understand, you're trying to build a web interface with three panels. I'd suggest structuring it as follows...",
  "When working with React components, it's important to consider state management. For your case, I would recommend...",
  "For file operations in a JavaScript environment, you have several options. The most straightforward approach would be...",
  "Terminal emulation in a browser can be accomplished using libraries like xterm.js. Here's how you might implement that...",
  "Let me walk you through how the code works. First, we initialize the components, then we set up the event listeners..."
];

// Sample code snippets for demonstration
const codeSnippets = [
  "```javascript\nfunction calculateSum(arr) {\n  return arr.reduce((sum, num) => sum + num, 0);\n}\n```",
  "```javascript\nconst fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n};\n```",
  "```javascript\nconst AppContainer = styled.div`\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  height: 100vh;\n  width: 100vw;\n`;\n```",
  "```javascript\nconst handleFileClick = (file) => {\n  if (file.type === 'folder') {\n    setCurrentPath([...currentPath, file.name]);\n  } else {\n    setSelectedFile(file);\n  }\n};\n```",
  "```bash\n# Clone the repository\ngit clone https://github.com/username/repo.git\n\n# Install dependencies\nnpm install\n\n# Start the development server\nnpm start\n```"
];

/**
 * Simulates sending a message to Claude and getting a response
 * @param {string} message - User message to send to Claude
 * @returns {Promise<string>} - Claude's response
 */
export const sendMessageToClaude = async (message) => {
  try {
    // In a real implementation, this would call a Claude API endpoint
    // For example:
    // const response = await axios.post('/api/claude', { 
    //   prompt: message,
    //   model: 'claude-3-opus-20240229'
    // });
    // return response.data.completion;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Check if the message is a code-related query or question
    const isCodeRelated = /code|function|component|javascript|react|terminal|style|css|html|api|fetch|axios|async|promise|interface|class|method/i.test(message);
    
    // For demo, generate a somewhat contextual response
    let response = '';
    
    // Simple context-aware responses based on the message content
    if (message.includes('hello') || message.includes('hi ')) {
      response = "Hello! I'm Claude. How can I help you with your coding project today?";
    } else if (message.includes('help')) {
      response = "I'd be happy to help! What specific part of your project do you need assistance with? I can help with React components, file operations, terminal commands, or general JavaScript questions.";
    } else if (message.includes('thank')) {
      response = "You're welcome! Feel free to ask if you need help with anything else.";
    } else if (isCodeRelated) {
      // For code-related queries, include both text and a code snippet
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      response = `${randomResponse}\n\nHere's an example that might help:\n\n${randomSnippet}`;
    } else {
      // For general queries, just use a text response
      response = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    }

    // Very basic simulation of Claude "thinking" about the prompt
    if (message.toLowerCase().includes('explain') || message.length > 100) {
      response = `I'll explain this in detail.\n\n${response}`;
    }
    
    return response;
    
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw new Error('Failed to communicate with Claude');
  }
};