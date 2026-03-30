import { useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Chatbot Support Team. How may I assist you today?",
      sender: "bot"
    }
  ]);

  const [input, setInput] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) =>
    /^[0-9]{10}$/.test(phone);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!name || !email || !phone) {
      alert("You need to fill the above info!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Enter valid email!");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("Enter valid 10-digit phone number!");
      return;
    }

    if (!isSubmitted) {
      try {
        await emailjs.send(
          "service_k2xh7i1",
          "template_qpogigc",
          { name, email, phone },
          "Q3My-HulobdKz-cn0"
        );

        await emailjs.send(
          "service_k2xh7i1",
          "template_mnb8kfs",
          { name, email, phone },
          "Q3My-HulobdKz-cn0"
        );

        alert("Enquiry sent successfully!");
        setIsSubmitted(true);

      } catch (err) {
        console.error("EMAIL ERROR:", err);
        alert("Failed to send email");
      }
    }

    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyAF8Nsw_RHYiW3t0LdwYFTAGBXLAsARmRY"
          }
        }
      );

      const botText =
        res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setMessages((prev) => [
        ...prev,
        { text: botText, sender: "bot" }
      ]);
    } catch (err) {
      console.log(err)
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error getting response", sender: "bot" }
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-full shadow-lg cursor-pointer"
      >
        {/* 💬 */}

        <img src="https://www.shutterstock.com/image-vector/happy-robot-3d-ai-character-600nw-2464455965.jpg" 
        
        className="rounded-full h-10 w-10 cursor-pointer" />
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-5 w-[350px] h-[550px] bg-[#1f2937] rounded-2xl shadow-xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center justify-between p-3 bg-[#111827] text-white">
            <div className="flex items-center gap-2">
              <img
                src="https://www.shutterstock.com/image-vector/happy-robot-3d-ai-character-600nw-2464455965.jpg"
                className="rounded-full w-10 h-10"
                alt="avatar"
              />
              <div>
                <div className="font-semibold text-sm">
                  Chatbot Support Team 🤖
                </div>
                <div className="text-xs text-gray-400">
                  Support Team
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 flex flex-col">

            {/* CHAT TAB */}
            {activeTab === "chat" && (
              <>
                {/* Intro */}
                <div className="p-3 text-sm text-gray-300">
                  Hello! I'm <b>Chatbot Support Team</b> here to help you.
                  <br />
                  <span className="text-xs text-gray-400">
                    This conversation is handled by an AI Agent.
                  </span>
                </div>

                {/* FORM */}
                {!isSubmitted && (
                  <div className="px-3 space-y-2">
                    <input
                      placeholder="Name"
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      placeholder="Email"
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      placeholder="Phone"
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-xl text-sm max-w-[75%]
                        ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* VOICE TAB */}
            {activeTab === "voice" && (
              <div className="flex flex-col items-center justify-center flex-1 text-white">
                <img
                  src="https://www.shutterstock.com/image-vector/happy-robot-3d-ai-character-600nw-2464455965.jpg"
                  className="rounded-full mb-4 h-10 w-10"
                  alt="voice"
                />
                <h2 className="font-semibold text-lg">
                  Chatbot Support Team 🤖
                </h2>
                <p className="text-gray-400 text-sm">
                  Support Team
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full animate-ping"></div>
                  Connecting
                </div>
              </div>
            )}

            {/* FORMS TAB */}
            {activeTab === "forms" && (
              <div className="p-4 text-white space-y-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <h3 className="font-semibold">
                    Support Request Form
                  </h3>
                  <p className="text-xs text-gray-400">
                    0 submissions
                  </p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <h3 className="font-semibold">
                    General Inquiry Contact Form
                  </h3>
                  <p className="text-xs text-gray-400">
                    0 submissions
                  </p>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="p-4 text-white space-y-4">
                <h2 className="text-lg font-semibold">
                  Save your conversations
                </h2>

                <button className="w-full bg-gray-800 p-2 rounded">
                  Continue with Google
                </button>

                <button className="w-full bg-gray-800 p-2 rounded">
                  Continue with Microsoft
                </button>

                <div className="text-center text-gray-400 text-sm">
                  OR
                </div>

                <button className="w-full bg-blue-600 p-2 rounded">
                  Sign up with Email
                </button>
              </div>
            )}
          </div>

          {/* INPUT (ONLY CHAT TAB) */}
          {activeTab === "chat" && (
            <div className="p-2 bg-[#111827] flex gap-2">
              <input
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-full"
                placeholder="Type here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 px-4 rounded-full text-white"
              >
                ➤
              </button>
            </div>
          )}

          {/* BOTTOM TABS */}
          <div className="flex justify-around text-xs text-gray-400 p-2 bg-black">
            <button onClick={() => setActiveTab("chat")}>
              Chat
            </button>
            <button onClick={() => setActiveTab("voice")}>
              Voice
            </button>
            <button onClick={() => setActiveTab("forms")}>
              Forms
            </button>
            <button onClick={() => setActiveTab("history")}>
              History
            </button>
          </div>
        </div>
      )}
    </>
  );
}