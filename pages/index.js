import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

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

      const resultBox = document.getElementById('result-box');
      resultBox.scrollTop = resultBox.scrollHeight;
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
          <input
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
              <div className={message.role === 'user' ? styles.user : styles.assistant}>{message.content}</div>
            </div>
          })
        }</div>
      </main>
    </div>
  );
}
