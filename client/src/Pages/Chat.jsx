import React, { useState } from "react";

const Chat = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const patients = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Mary Wanjiku" },
    { id: 3, name: "David Otieno" }
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      { text: message, sender: "user" },
      { text: "Thank you. A doctor will respond shortly.", sender: "bot" }
    ]);

    setMessage("");
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>💬 Chats</h3>
        {patients.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.chatItem,
              background: selectedPatient?.id === p.id ? "#e0f2f1" : ""
            }}
            onClick={() => {
              setSelectedPatient(p);
              setMessages([]);
            }}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {selectedPatient ? (
          <>
            <div style={styles.chatHeader}>
              🟢 {selectedPatient.name}
            </div>

            <div style={styles.messages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.message,
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    background:
                      msg.sender === "user" ? "#dcf8c6" : "#ffffff"
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={styles.inputArea}>
              <input
                style={styles.input}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button style={styles.button} onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={styles.empty}>
            👈 Select a patient to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "80vh",
    border: "1px solid #ccc"
  },
  sidebar: {
    width: "25%",
    borderRight: "1px solid #ccc",
    padding: "10px",
    background: "#f0f2f5"
  },
  chatItem: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "5px"
  },
  chatArea: {
    width: "75%",
    display: "flex",
    flexDirection: "column"
  },
  chatHeader: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    background: "#075e54",
    color: "#fff",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#ece5dd"
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "60%"
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc"
  },
  input: {
    flex: 1,
    padding: "8px"
  },
  button: {
    marginLeft: "10px",
    padding: "8px 16px",
    background: "#25d366",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  empty: {
    margin: "auto",
    fontSize: "18px",
    color: "#777"
  }
};

export default Chat;
