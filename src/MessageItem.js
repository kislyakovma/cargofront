import React from "react";

export default function MessageItem(props) {
  /* message position formatting - right if I'm the author */
  const messagePosition = props.owner == props.sender
    ? "chatApp__convMessageItem--right"
    : "chatApp__convMessageItem--left";
  return (
    <div
      className={`chatApp__convMessageItem ${messagePosition} clearfix`}
    >
      <img
        src={props.senderAvatar}
        alt={props.sender}
        className="chatApp__convMessageAvatar"
      />
      <div
        className="chatApp__convMessageValue"
        dangerouslySetInnerHTML={{ __html: props.message }}
      />
    </div>
  );
}
