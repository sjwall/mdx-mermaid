import React from 'react';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Mermaid chart={`sequenceDiagram
          participant Mermaid
          participant React
          Mermaid->>React: Hello React, how are you?`} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
