import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import MarkdownIt from "markdown-it";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const md = new MarkdownIt();
export default function Home() {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (!question) {
        alert('请输入问题~')
        return;
      }
      setLoading(true);
      const newMessage = [...messages, { "role": "user", "content": question }]
      setMessages(messages => {
        return newMessage
      })
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessage }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setMessages(messages => {
        return [...messages, { "role": "assistant", "content": data.result }]
      })
      setQuestion("");

      setTimeout(() => {
        const resultBox = document.getElementById('result-box');
        resultBox.scrollTop = resultBox.scrollHeight;
      }, 100)

      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setLoading(false);
      alert(error.message);
    }
  }

  const handleInput = (e) => {
    const value = e.target.value;
    setQuestion(value)
  }

  const renderMarkdown = (content) => {
    const contents = content.split('```');
    const results = [];
    let inCode = false;
    contents.forEach((item, index) => {
      const reg = /^(python|javascript|c\+\+|java|c)(?=\n)/
      const language = item.match(reg)?.[1];
      if (inCode) {
        results.push(
          <SyntaxHighlighter
            showLineNumbers={true}
            startingLineNumber={0}
            language={language}
            // style={dark}
            lineNumberStyle={{ color: '#ddd', fontSize: 14 }}
            wrapLines={true}
          // lineProps={(num) => { console.log(num) }}
          >
            {item.replace(reg, '')}
          </SyntaxHighlighter>
        )
      } else {
        results.push(<div dangerouslySetInnerHTML={{ __html: md.render(item) }}></div>)
      }
      inCode = !inCode;
    })

    return results
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>hello chatGpt</h3>
        <p>使用chatGPT 3.5驱动</p>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="animal"
            placeholder="请输入你的问题"
            value={question}
            onChange={handleInput}
            disabled={loading}
            className={loading ? styles.disabled : ''}
          />
          <input type="submit" disabled={loading} className={loading ? styles.disabled : ''} value="点击提问" />
        </form>
        <div className={styles.result} id="result-box">{
          messages.map(message => {
            return <div className={styles.resultItem}>
              <div className={message.role === 'user' ? styles.user : styles.assistant}>
                <div>{renderMarkdown(message.content)}</div>
              </div>
            </div>
          })
        }</div>
      </main>
    </div>
  );
}
