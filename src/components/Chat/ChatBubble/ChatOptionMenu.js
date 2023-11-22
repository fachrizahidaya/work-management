import { Actionsheet } from "native-base";
import React from "react";

const ChatOptionMenu = ({ optionIsOpen, toggleOption, setMessageToReply, chat, toggleDeleteModal }) => {
  return (
    <Actionsheet isOpen={optionIsOpen} onClose={toggleOption}>
      <Actionsheet.Content>
        <Actionsheet.Item
          onPress={() => {
            setMessageToReply(chat);
            toggleOption();
          }}
        >
          Reply
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
            toggleDeleteModal();
            toggleOption();
          }}
        >
          Delete
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChatOptionMenu;
