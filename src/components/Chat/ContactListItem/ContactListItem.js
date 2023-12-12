import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Box, Flex, HStack, Icon, Pressable, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FlingGestureHandler, Directions, State, PanGestureHandler } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const LIST_ITEM_HEIGHT = 70;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import axiosInstance from "../../../config/api";

const ContactListItem = ({
  chat,
  type,
  id,
  userId,
  name,
  image,
  position,
  email,
  message,
  isDeleted,
  fileName,
  project,
  task,
  time,
  timestamp,
  searchKeyword,
  active_member,
  isRead,
  isPinned,
  toggleDeleteModal,
  toggleContactOption,
  onSwipe,
}) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const navigation = useNavigation();

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderName = () => {
    return boldMatchCharacters(name, searchKeyword);
  };

  const generateIcon = () => {
    let iconName = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        iconName = "image";
      } else {
        iconName = "file-document";
      }
    }
    if (project) {
      iconName = "lightning-bolt";
    }
    if (task) {
      iconName = "checkbox-marked-circle-outline";
    }

    return iconName;
  };

  const generateAttachmentText = () => {
    let text = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        text = "Photo";
      } else {
        text = "File";
      }
    }
    if (project) {
      text = "Project";
    }
    if (task) {
      text = "Task";
    }

    return text;
  };

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = -100;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: (-100, 0),
      outputRange: (0, 1),
    });

    const onSwipeAction = () => {
      onSwipe(chat);
      setIsMoreVisible(true);
    };

    return (
      <>
        <Pressable
          style={{
            width: 50,
            alignItems: "center",
            backgroundColor: "#959595",
            justifyContent: "center",
            padding: 3,
            transform: [{ translateX: trans }],
          }}
          onPress={() => {
            onSwipeAction();
            setIsMoreVisible(false);
          }}
        >
          <Icon as={<MaterialIcons name="more-horiz" />} color="white" />
          <Text fontSize={12} fontWeight={400} style={{ color: "white" }}>
            More
          </Text>
        </Pressable>
      </>
    );
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      translateX.value = withTiming(0);
    },
  });

  const rStyle = useAnimatedStyle(() => ({}));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacityValue = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0);
    return { opacity: opacityValue };
  });

  const rTaskContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value,
    transform: [
      {
        translateX: translateX.value,
      },
    ],
    backgroundColor: "white",
  }));

  return (
    <Box>
      <Pressable
        mt={5}
        style={[styles.iconContainer]}
        alignItems="center"
        backgroundColor="#959595"
        justifyContent="center"
        padding={3}
      >
        <Icon as={<MaterialIcons name="more-horiz" />} color="white" />
        <Text fontSize={12} fontWeight={400} style={{ color: "white" }}>
          More
        </Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Chat Room", {
            userId: userId,
            name: name,
            roomId: id,
            image: image,
            position: position,
            email: email,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
          });
        }}
      >
        <PanGestureHandler onEnded={() => onSwipe(chat)} onGestureEvent={panGesture}>
          <Animated.View style={[rTaskContainerStyle]}>
            <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
              <Flex flexDir="row" gap={4} alignItems="center" flex={1}>
                <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />

                <Box flex={1}>
                  <HStack justifyContent="space-between">
                    {!searchKeyword ? (
                      <Text>{name}</Text>
                    ) : (
                      <RenderHtml
                        contentWidth={400}
                        source={{
                          html: renderName(),
                        }}
                      />
                    )}

                    <Flex flexDirection="row">
                      <ChatTimeStamp time={time} timestamp={timestamp} />
                    </Flex>
                  </HStack>

                  <Flex flexDir="row" alignItems="center" gap={1}>
                    {!isDeleted ? (
                      <>
                        <HStack alignItems="center" justifyContent="space-between" flex={1}>
                          {message && <Text>{message.length > 20 ? message.slice(0, 20) + "..." : message}</Text>}
                          {message === null && (project || task || fileName) && (
                            <HStack alignItems="center" space={1}>
                              <Icon as={<MaterialCommunityIcons name={generateIcon()} />} size="md" />
                              <Text>{generateAttachmentText()}</Text>
                            </HStack>
                          )}
                          {!!isRead && (
                            <Box
                              style={{
                                height: 25,
                                width: 25,
                              }}
                              bgColor="#FD7972"
                              borderRadius={10}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize={12} textAlign="center" color="white">
                                {isRead > 20 ? "20+" : isRead}
                              </Text>
                            </Box>
                          )}
                        </HStack>
                      </>
                    ) : (
                      <Text fontStyle="italic" opacity={0.5}>
                        Message has been deleted
                      </Text>
                    )}
                    {isPinned?.pin_chat ? (
                      <Icon
                        as={<MaterialCommunityIcons name="pin" />}
                        size="md"
                        style={{ transform: [{ rotate: "45deg" }] }}
                      />
                    ) : null}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    </Box>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  task: {
    width: "90%",
    height: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    paddingLeft: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
  },
});
