import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { FaRobot, FaUser } from "react-icons/fa";

// Styled components
const ChatBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const MessageText = styled.div`
  background-color: ${(props) => (props.isUser ? "#007bff" : "#e9ecef")};
  color: ${(props) => (props.isUser ? "white" : "black")};
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
  margin: 0 10px;
`;

// Reusable message renderer
const MessageItem = ({ msg }) => (
  <Message isUser={msg.sender === "user"}>
    {msg.sender === "user" ? <FaUser size={24} /> : <FaRobot size={24} />}
    <MessageText isUser={msg.sender === "user"}>{msg.text}</MessageText>
  </Message>
);

const Chatbot = ({ initialMessage }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show greeting
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Hello!";

    if (hour < 12) {
      greeting = "Good morning!";
    } else if (hour < 18) {
      greeting = "Good afternoon!";
    } else {
      greeting = "Good evening!";
    }

    setTimeout(() => {
      setMessages([
        {
          sender: "bot",
          text: `${greeting} How can I help you?`,
        },
      ]);
    }, 600);
  }, []);

  // Load initial message into input (but don't send yet)
  useEffect(() => {
    if (initialMessage) {
      const delayTyping = setTimeout(() => {
        setInput(initialMessage);
      }, 1200); // wait for greeting first

      return () => clearTimeout(delayTyping);
    }
  }, [initialMessage]);

  // Submit message
  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/AI_ChatBot/chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput.toLowerCase() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Non-JSON response from server");
      }

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data?.reply || "Sorry, no response found.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response from server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <Card.Body>
        <ChatBox>
          {messages.map((msg, idx) => (
            <MessageItem key={idx} msg={msg} />
          ))}
          {loading && (
            <MessageItem msg={{ sender: "bot", text: "Processing..." }} />
          )}
          <div ref={chatEndRef} />
        </ChatBox>

        <Form onSubmit={sendMessage} className="mt-3 d-flex">
          <Form.Control
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <Button type="submit" className="ms-2">
            Send
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Chatbot;
