import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList(props) {
  return (
    <div className="chatApp__convTimeline">
      {props.messages
        .slice(0)
        .reverse()
        .map((messageItem) => (
          <MessageItem
            key={messageItem.id}
            owner={props.owner}
            sender={messageItem.sender}
            senderAvatar={messageItem.senderAvatar}
            message={messageItem.message}
          />
        ))}
    </div>
  );
}
