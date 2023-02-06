import React from 'react';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'
import ReactMarkdown from 'react-markdown'
import mermaid from 'mdx-mermaid'
import logo from './logo.svg';
import './App.css';

const markdown = `\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\``

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Mermaid config={{mermaid: {theme: 'dark'}}} chart={`sequenceDiagram
          participant Mermaid
          participant React
          Mermaid->>React: Hello React, how are you?`} />

        <ReactMarkdown children={markdown} remarkPlugins={[mermaid]} components={{mermaid: Mermaid} as any} />
      </header>
    </div>
  );
}

export default App;
