import { useSelector } from "react-redux";

import { Linking, StyleSheet } from "react-native";
import { Flex, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";

const ChatBubble = ({ chat, image, name, fromUserId, id, content, time }) => {
  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector.id === fromUserId;

  if (typeof content !== "number" || content.length > 1) {
    const words = content?.split(" ");
    var styledTexts = words?.map((item, index) => {
      let textStyle = styles.defaultText;
      if (item.includes("https")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
            {item}{" "}
          </Text>
        );
      } else if (item.includes("08") || item.includes("62")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => CopyToClipboard(item)}>
            {item}{" "}
          </Text>
        );
      } else if (item.includes("@gmail.com")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => handleEmailPress(item)}>
            {item}{" "}
          </Text>
        );
      }
      return (
        <Text key={index} style={textStyle}>
          {item}{" "}
        </Text>
      );
    });
  }

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleEmailPress = (email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex m={2} flexDirection={!myMessage ? "row" : "row-reverse"}>
      {!myMessage && <AvatarPlaceholder name={name} image={chat.user?.image} size="md" isThumb={false} />}

      <Flex flexDirection={!myMessage ? "row" : "row-reverse"}>
        <Flex
          borderRadius={15}
          py={2}
          px={4}
          bgColor={!myMessage ? "white" : "primary.600"}
          maxW={280}
          flexDirection={name !== chat.user?.name && !myMessage ? "column" : "row"}
          justifyContent="center"
          // borderWidth={!myMessage ? 1 : 0}
          // borderColor={!myMessage && "#E8E9EB"}
        >
          {name !== chat.user?.name && !myMessage && (
            <Text color={!myMessage ? "primary.600" : "white"}>{chat.user?.name}</Text>
          )}
          {typeof content === "number" ? (
            <Text color={!myMessage ? "primary.600" : "white"}>{content}</Text>
          ) : (
            <Text color={!myMessage ? "primary.600" : "white"}>{styledTexts}</Text>
          )}
          <Text
            mt={name !== chat.user?.name && !myMessage ? null : 2.5}
            alignSelf="flex-end"
            fontSize={10}
            color="#578A90"
          >
            {time}
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
