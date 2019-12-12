import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { Card, Icon, Row, Col, Avatar } from "antd";
import usePushNotifications from "./usePushNotifications";
import ChatBox from "./ChatBox";

import { get } from "http";

const { Meta } = Card;

/* end InputMessage component */
/* ========== */

/* ========== */
/* TypingIndicator component */

/* end TypingIndicator component */
/* ========== */

/* ========== */
/* MessageList component - contains all messages */

/* end MessageList component */
/* ========== */

/* ========== */
/* MessageItem component - composed of a message and the sender's avatar */

/* end MessageItem component */
/* ========== */

/* ========== */
/* ChatBox component - composed of Title, MessageList, TypingIndicator, InputMessage */

/* end ChatBox component */
/* ========== */

/* ========== */
/* ChatRoom component - composed of multiple ChatBoxes */
function ChatRoom() {
  const {
    userConsent,
    pushNotificationSupported,
    userSubscription,
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    sub,
    error,
    loading
  } = usePushNotifications();

  const isConsentGranted = userConsent === "granted";

  /* pushServerSubscriptionId is defined here
    TODO: handle subscription
  */
  useEffect(() => {
    if (pushServerSubscriptionId) {
      console.log({
        lo: "huiiiiiiii",
        pushServerSubscriptionId
      });
      fetch("http://localhost:4000/api/subcscribe", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify({
          email: `${makeId(10)}@pidr.com`,
          adminSubscription: pushServerSubscriptionId,
          aSub: sub
        }) // тип данных в body должен соответвовать значению заголовка "Content-Type"
      }).then(response => {
        console.log(response);
      });
    }
  }, [pushServerSubscriptionId]);

  // constructor(props, context) {
  //   super(props, context);
  //   this.state = {
  //     messages: [],
  //     isTyping: []
  //   };
  //   this.sendMessage = this.sendMessage.bind(this);
  //   this.typing = this.typing.bind(this);
  //   this.resetTyping = this.resetTyping.bind(this);
  //   this.chatSelector = this.chatSelector.bind(this);
  // }
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState([]);
  const [chatSelect, setChatSelect] = useState("");
  const [chats, setChats] = useState();

  function getMessages() {
    console.log(messages);
    if (chatSelect != false) {
      fetch("http://localhost:4000/api/messages", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify({ phone: chatSelect }) // тип данных в body должен соответвовать значению заголовка "Content-Type"
      })
        .then(response => response.json())
        .then(data => {
          const sendIt = [];
          data.forEach((item, i) => {
            item.id = i + 1;
          });

          data.map(item => {
            const message = {
              id: item.id,
              sender: item.type,
              senderAvatar:
                "https://avatanplus.com/files/photos/mid/568e4387687401521bb7c904.jpg",
              message: item.text
            };
            sendIt.push(message);
          });
          console.log(sendIt);
          setMessages(sendIt);
        });
    } else {
      console.log("HA");
      setMessages([]);
    }
  }
  function getChats() {
    fetch("http://31.173.82.176:4000/api/chats", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
      // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
      .then(response => response.json())
      .then(data => {
        data.sort((x, y) => y.lastTime - x.lastTime);
        setChats(data);
      });
  }
  function getFirstChat() {
    fetch("http://31.173.82.176:4000/api/chats", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
      // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
      .then(response => response.json())
      .then(data => {
        data.sort((x, y) => y.lastTime - x.lastTime);
        setChatSelect(data[0].driverPhone);
      });
  }
  const handlePush = useCallback(
    (event, chatSelect) => {
      console.log(chatSelect, event.data.msg);

      if (chatSelect !== event.data.msg) {
        console.log("Новое сообщение");
        getChats();
      } else {
        console.log("s");
        getMessages();
      }
    },
    [getMessages]
  );
  const makeId = length => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    navigator.serviceWorker.removeEventListener(
      "message",
      console.log("removed")
    );
    console.log(chatSelect);
    getChats();

    getMessages();
    if (pushNotificationSupported || !isConsentGranted) {
      onClickAskUserPermission();
    }
    if (!userSubscription) {
      onClickSusbribeToPushNotification();
    }
    if (!pushServerSubscriptionId) {
      onClickSendSubscriptionToPushServer();
    }

    navigator.serviceWorker.addEventListener("message", event => {
      handlePush(event, chatSelect);
    });
  }, [chatSelect]);
  useEffect(() => {
    console.log(
      JSON.stringify({
        email: `${makeId(10)}@pidr.com`,
        adminSubscription: pushServerSubscriptionId,
        aSub: sub
      })
    );
    fetch("http://31.173.82.176:4000/api/subcscribe", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        email: `${makeId(10)}@pidr.com`,
        adminSubscription: pushServerSubscriptionId,
        aSub: sub
      }) // тип данных в body должен соответвовать значению заголовка "Content-Type"
    }).then(response => {
      console.log(response);
    });
    getFirstChat();
  }, []);

  useEffect(() => {
    console.log("AUE");
    console.log(chatSelect);
    setSub();
  }, [chatSelect]);
  /* adds a new message to the chatroom */
  const sendMessage = (sender, senderAvatar, message) => {
    console.log(pushServerSubscriptionId);
    fetch("http://31.173.82.176:4000/api/chat", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        phone: chatSelect,
        message: {
          text: message,
          type: "admin",
          timestamp: Date.now().toString(),
          adminSubscription: pushServerSubscriptionId,
          aSub: sub
        }
      }) // тип данных в body должен соответвовать значению заголовка "Content-Type"
    }).then(response => {
      console.log(response);

      const msg = {
        id: messages.length + 1,
        sender: "admin",
        senderAvatar:
          "https://avatanplus.com/files/photos/mid/568e4387687401521bb7c904.jpg",
        message
      };
      messages.push(msg);
      getChats();
    });
  };
  const setSub = () => {
    console.log(
      JSON.stringify({
        email: `${makeId(10)}@pidr.com`,
        adminSubscription: pushServerSubscriptionId,
        aSub: sub
      })
    );
  };
  /* updates the writing indicator if not already displayed */
  const typing = writer => {
    if (!isTyping[writer]) {
      const stateTyping = isTyping;
      stateTyping[writer] = true;
      setIsTyping(stateTyping);
    }
  };
  /* hide the writing indicator */
  const resetTyping = writer => {
    const stateTyping = isTyping;
    stateTyping[writer] = false;
    setIsTyping(stateTyping);
  };
  const chatSelector = selector => {
    setChatSelect(selector);
  };

  const users = {};
  const chatBoxes = [];
  const dialogs = chats || [];

  /* user details - can add as many users as desired */
  users[0] = {
    name: "admin",
    avatar:
      "https://avatanplus.com/files/photos/mid/568e4387687401521bb7c904.jpg"
  };

  /* test with two other users :)
		users[2] = { name: 'Kate', avatar: 'https://i.pravatar.cc/150?img=47' };
		users[3] = { name: 'Patrick', avatar: 'https://i.pravatar.cc/150?img=14' };
		*/

  /* creation of a chatbox for each user present in the chatroom */
  Object.keys(users).map(key => {
    const user = users[key];
    chatBoxes.push(
      <ChatBox
        key={key}
        owner={user.name}
        ownerAvatar={user.avatar}
        sendMessage={sendMessage}
        typing={typing}
        resetTyping={resetTyping}
        messages={messages}
        isTyping={isTyping}
      />
    );
  });

  return (
    <div style={{ backgroundColor: "#f5f5f5", flex: "1" }}>
      <Row style={{}}>
        <Col span={4} style={{ minWidth: 200 }}>
          {dialogs.map(item => (
            <Card
              style={{
                flex: 1,
                backgroundColor: "#fbfbfb"
              }}
              onClick={() => {
                chatSelector(item.driverPhone);
                console.log(chatSelect);
              }}
            >
              <Meta
                avatar={
                  <Avatar
                    src="https://avatanplus.com/files/photos/mid/568e4387687401521bb7c904.jpg"
                    style={{ marginTop: 12 }}
                  />
                }
                title={item.driverName || "Водитель"}
                description={item.driverPhone}
              />
            </Card>
          ))}
        </Col>
        <Col span={20}>{chatBoxes}</Col>
      </Row>
    </div>
  );
}

/* end ChatRoom component */
/* ========== */

/* render the chatroom */

export default ChatRoom;
