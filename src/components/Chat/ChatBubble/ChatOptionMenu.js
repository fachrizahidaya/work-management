import { Actionsheet } from "native-base";

const ChatOptionMenu = ({ optionIsOpen, onClose, setMessageToReply, chat, toggleDeleteModal }) => {
  return (
    <Actionsheet isOpen={optionIsOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Actionsheet.Item
          onPress={() => {
            setMessageToReply(chat);
            onClose();
          }}
        >
          Reply
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
            toggleDeleteModal();
          }}
        >
          Delete
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChatOptionMenu;
