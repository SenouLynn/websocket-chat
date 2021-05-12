//Dependencies//
import React from "react";
import { client, w3cwebsocket as W3CWebSocket } from "websocket";
import { useEffect, useState, useRef } from "react";

//Some bullshit from Ant Designs
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

//Components//
import Home from "./Home";
import Login from "./Login";

//Define socket
const socketClient = new W3CWebSocket("ws://localhost:8000/");
export default function App() {
  //Dont' let anything happen until websocket connection is made
  let [isOpen, setIsOpen] = useState(false);

  //Authentication State
  let [userState, setUserState] = useState({
    userName: "",
    isLoggedIn: false,
  });

  let [chatHistory, setChatHistory] = useState([]);

  //Open up WebSocket connection
  useEffect(() => {
    socketClient.onopen = () => {
      console.log("Websocket Client Connected");
      setIsOpen(true);
    };

    socketClient.onmessage = (message) => {
      console.log("chat history inside onmessage", chatHistory);
      const dataFromServer = JSON.parse(message.data);
      console.log("Reply from Server: ", dataFromServer);

      if (dataFromServer.type === "message") {
        let incomingMessage = {
          msg: dataFromServer.msg,
          user: dataFromServer.user,
        };
        updateMessages(chatHistory, incomingMessage);
      }
    };
  });

  //Update chatArray
  //I should figure out how to send all this to a database for persisting changes
  function updateMessages(chatHistory, incomingMessage) {
    let chatArray = [...chatHistory];
    console.log(
      "Chathistory: ",
      chatHistory,
      "icoming message: ",
      incomingMessage
    );
    chatArray.push(incomingMessage);
    setChatHistory(chatArray);
  }

  //<--- Conditionally Render Components--->//
  //Storing username in state and passing it to Home component, along with chat history
  //Once name is input, then show homepage
  let loginComponent;
  userState.isLoggedIn === false
    ? // loginComponent = <Login />
      (loginComponent = (
        <div>
          <Search
            placeholder="Enter Username"
            enterButton="Go Forth"
            size="large"
            onSearch={(value) =>
              setUserState({ userName: value, isLoggedIn: true, messages: [] })
            }
          />
        </div>
      ))
    : (loginComponent = (
        <Home
          userName={userState.userName}
          isSocketOpen={isOpen}
          chatHistory={chatHistory}
        />
      ));
  return (
    <div>
      <div className="title">
        <Text id="main-heading" type="secondary" style={{ fontSize: "36px" }}>
          Socket Chat
        </Text>
      </div>
      {loginComponent}
    </div>
  );
}
