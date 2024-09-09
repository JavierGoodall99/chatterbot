"use client";
import { useState } from "react";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is ChatterBot! How can I help you today?",
    },
  ]);

  const callGetResponse = async () => {
    setIsLoading(true);
    const temp = messages;
    temp.push({ role: "user", content: theInput });
    setMessages(temp);
    setTheInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);
  };

  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6">ChatterBot</h1>

      <div className="flex flex-col h-[35rem] w-[40rem] bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-col gap-2 overflow-y-auto p-6 flex-grow">
          {messages.map((e) => (
            <div
              key={e.content}
              className={`w-max max-w-[18rem] rounded-lg px-4 py-2 shadow-sm h-min ${e.role === "assistant"
                  ? "self-start bg-gray-100 text-gray-800"
                  : "self-end bg-blue-600 text-white"
                }`}
            >
              {e.content}
            </div>
          ))}

          {isLoading ? (
            <div className="self-start bg-gray-100 text-gray-800 w-max max-w-[18rem] rounded-lg px-4 py-2 shadow-sm">
              *thinking*
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="relative flex w-full px-6 py-4 bg-gray-100 border-t border-gray-200">
          <textarea
            value={theInput}
            onChange={(event) => setTheInput(event.target.value)}
            className="w-[85%] h-12 p-3 resize-none overflow-y-auto text-gray-700 bg-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Type your message..."
            onKeyDown={Submit}
          />
          <button
            onClick={callGetResponse}
            className="w-[15%] bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
