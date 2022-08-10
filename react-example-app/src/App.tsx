import React from 'react';
import type mermaidAPI from 'mermaid/mermaidAPI';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Mermaid config={{mermaid: {theme: 'dark' as mermaidAPI.Theme}}} chart={`sequenceDiagram
          participant Mermaid
          participant React
          Mermaid->>React: Hello React, how are you?`} />
      </header>
    </div>
  );
}

export default App;
