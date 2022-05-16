import { useState } from "react";
import { Client } from "@stomp/stompjs";

function Test() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState(
    "Disconnected! Please type a message and click send."
  );
  const [messages, setMessages] = useState([]);
  const client = new Client({
    brokerURL: "ws://devdocker.cloudsweet.net:9992/ws",
    connectHeaders: {
      login: "guest",
      passcode: "guest",
    },
    debug: function (str) {
      console.log(str);
    },
    // reconnectDelay: 5000,
    // heartbeatIncoming: 4000,
    // heartbeatOutgoing: 4000,
  });

  client.onStompError = function (frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };

  client.activate();
  // client.deactivate();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    client.onConnect = function (frame) {
      setStatus("Connected");
      console.log("connected");
      client.publish({
        destination: "/queue/hello",
        body: text,
      });
      client.subscribe("/queue/hello", function (message) {
        setMessages((messages) => [...messages, message.body]);
        console.log(message.body);
      });
    };
  };

  return (
    <div className="container">
      {/* display status */}
      <p>Status: {status} </p>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              onChange={(e) => setText(e.target.value)}
            />
            <span className="input-group-btn">
              <button className="btn btn-primary" type="submit">
                Send
              </button>
            </span>
          </div>
        </div>
      </form>
      <div className="messages">
        {messages.map((message) => (
          <ul className="list-group">
            <li key="{message}" className="list-group-item">
              {message}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default Test;
