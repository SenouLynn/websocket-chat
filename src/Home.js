//Dependencies
import React, { useState } from "react";
import { client, w3cwebsocket as W3CWebSocket } from "websocket";

//Some bullshit from Ant Designs
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import Search from "antd/lib/input/Search";

const { Text } = Typography;
const { Meta } = Card;

//Web Socket Connection Info
const socketClient = new W3CWebSocket("ws://localhost:8000/");
export default function Home(props) {
  //   Pushes messaging information
  function onButtonClicked(value) {
    if (props.isSocketOpen) {
      console.log("You clicked a button");
      socketClient.send(
        JSON.stringify({
          type: "message",
          msg: value,
          user: props.userName,
        })
      );
    }
    //Resets chatbox after sending a message
    setChatState("")
  }

  //  Chat Div Builder
  let chatDiv;
  if (props.chatHistory !== []) {
    chatDiv = props.chatHistory.map((msg) => (
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
        <Card
          key={msg.msg}
          style={{

            width: 300,
            margin: "16px 4px 0 4px",
            alignSelf:
              props.userName === msg.user ? "flex-end" : "flex-start",
          }}
          loading={false}
        >
          <Meta
            avatar={
              <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                {msg.user[0].toUpperCase()}
              </Avatar>
            }
            title={msg.user + ":"}
            description={msg.msg}
          />
        </Card>
      </div>
    ));
  } else {
    chatDiv = (
      <div>
        <p>No Messages Yet!</p>
      </div>
    );
  }

  //Chat State Updater
  let [chatState, setChatState] = useState("");

  //Compile
  return (
    <div>
      {chatDiv}
      <div className="bottom">
        <Search
          placeholder="Mesage........."
          enterButton="Send"
          value={chatState}
          size="large"
          onChange={(e) => setChatState(e.target.value)}
          onSearch={(value) => onButtonClicked(value)}
        />
      </div>
    </div>
  );
}
