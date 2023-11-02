import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { Linking, StyleSheet } from "react-native";
import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatBubble = ({ chat, image, name, fromUserId, id, content, time }) => {
  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector.id === fromUserId;

  const words = content.split(" ");
  const styledTexts = words.map((item, index) => {
    let textStyle = styles.defaultText;
    if (item.includes("https")) {
      textStyle = styles.highlightedText;
    }
    return (
      <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
        {item}{" "}
      </Text>
    );
  });

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <Flex m={2} flexDirection={!myMessage ? "row" : "row-reverse"}>
      {!myMessage && <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />}

      <Flex flexDirection={!myMessage ? "row" : "row-reverse"}>
        <Flex
          borderRadius={15}
          py={2}
          px={4}
          bgColor={!myMessage ? "white" : "primary.600"}
          maxW={280}
          flexDirection="row"
          justifyContent="center"
          // borderWidth={!myMessage ? 1 : 0}
          // borderColor={!myMessage && "#E8E9EB"}
        >
          <Text color={!myMessage ? "primary.600" : "white"}>{styledTexts}</Text>
          <Text mt={2.5} alignSelf="flex-end" fontSize={10} color="#578A90">
            14:05
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
});
