import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/messages")
            .then(res => setMessages(res.data));

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() && username.trim()) {
            const messageData = { user: username, message: newMessage };
            socket.emit("sendMessage", messageData);

            axios.post("http://localhost:5000/api/messages", messageData);
            setNewMessage("");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Live Chat</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 text-black rounded"
                />
            </div>

            <div className="h-60 overflow-y-auto border p-2 rounded mb-4">
                {messages.map((msg, i) => (
                    <p key={i}>
                        <span className="font-bold">{msg.user}: </span>
                        {msg.message}
                    </p>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 text-black rounded"
                />
                <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}
