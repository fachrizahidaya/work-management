import { Actionsheet, AlertDialog, Box, Button, Divider, Flex, Icon, Modal, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChatOptionMenu = ({
  optionIsOpen,
  onClose,
  setMessageToReply,
  chat,
  toggleDeleteModal,
  bubbleChangeColor,
  setBubbleChangeColor,
  placement,
}) => {
  const options = [
    {
      name: "Reply",
      icon: "reply-outline",
      onPress: () => {
        setMessageToReply(chat);
        onClose();
      },
      color: "#176688",
    },
    // {
    //   name: "Forward",
    //   icon: "share",
    //   onPress: null,
    //   color: "#176688",
    // },
    // {
    //   name: "Copy",
    //   icon: "content-copy",
    //   onPress: null,
    //   color: "#176688",
    // },
    // {
    //   name: "Report",
    //   icon: "alert-outline",
    //   onPress: null,
    //   color: "#FF0303",
    // },
    {
      name: "Delete",
      icon: "trash-can-outline",
      onPress: () => {
        toggleDeleteModal();
        onClose();
      },
      color: "#FF0303",
    },
  ];

  return (
    <>
      {/* <Actionsheet isOpen={optionIsOpen} onClose={onClose}>
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
      </Actionsheet> */}
      <Modal isOpen={optionIsOpen} onClose={onClose} safeAreaTop={true}>
        <Modal.Content width={200} {...styles[placement]}>
          <Modal.Body gap={3}>
            {options.map((option, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={option.onPress}
                  display="flex"
                  borderBottomColor="#F6F6F6"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Text fontSize={16} fontWeight={400}>
                    {option.name}
                  </Text>
                  <Icon as={<MaterialCommunityIcons name={option.icon} />} size={6} color={option.color} />
                </Pressable>
              );
            })}
            {/* <Flex alignItems="center" flexDirection="row" justifyContent="space-between">
              <Text fontSize={16} fontWeight={400}>
                test
              </Text>
              <Icon as={<MaterialCommunityIcons name="reply-outline" />} size={6} color="#176688" />
            </Flex> */}
            {/* <Flex alignItems="center" flexDirection="row" justifyContent="space-between">
              <Text fontSize={16} fontWeight={400}>
                test
              </Text>
              <Icon as={<MaterialCommunityIcons name="trash-can-outline" />} size={6} color="#FF0303" />
            </Flex> */}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ChatOptionMenu;

const styles = {
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
};
