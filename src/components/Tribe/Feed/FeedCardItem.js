import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";

import { Flex, Image, Text, Icon, Pressable, Modal, Badge } from "native-base";
import { Linking, StyleSheet, TouchableOpacity, Clipboard } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";

const FeedCardItem = ({
  id,
  employeeId,
  employeeName,
  createdAt,
  employeeImage,
  content,
  total_like,
  totalComment,
  likedBy,
  attachment,
  type,
  loggedEmployeeId,
  loggedEmployeeImage,
  onToggleLike,
  onCommentToggle,
  refetchPost,
  forceRerender,
  setForceRerender,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);

  const navigation = useNavigation();

  /**
   * Like post control
   */
  const [likeAction, setLikeAction] = useState("dislike");
  const toggleLikeHandler = (post_id, action) => {
    if (action === "like") {
      setLikeAction("dislike");
      setTotalLike((prevState) => prevState + 1);
    } else {
      setLikeAction("like");
      setTotalLike((prevState) => prevState - 1);
    }
    onToggleLike(post_id, action);
    setForceRerender(!forceRerender);
  };

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const words = content.split(" ");
  const styledTexts = words.map((item, index) => {
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
        <Text key={index} style={textStyle} onPress={() => copyToClipboard(item)}>
          {item}{" "}
        </Text>
      );
    } else if (item.includes("@") && item.includes(".com")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleEmailPress(item)}>
          {item}{" "}
        </Text>
      );
    } else {
      textStyle = styles.defaultText;
      return (
        <Text key={index} style={textStyle}>
          {item}{" "}
        </Text>
      );
    }
  });

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

  const copyToClipboard = (text) => {
    try {
      if (typeof text !== String) {
        var textToCopy = text.toString();
        Clipboard.setString(textToCopy);
      } else {
        Clipboard.setString(text);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (likedBy && likedBy.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <Flex flexDir="column" my={2}>
      <Flex gap={5} style={card.card}>
        <Flex alignItems="center" direction="row" gap={3}>
          <Pressable
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: employeeId,
                loggedEmployeeId: loggedEmployeeId,
                loggedEmployeeImage: loggedEmployeeImage,
                refetchPost: refetchPost,
                forceRerender: forceRerender,
                setForceRerender: setForceRerender,
              })
            }
          >
            <AvatarPlaceholder image={employeeImage} name={employeeName} size={10} isThumb={false} />
          </Pressable>

          <Flex flex={1}>
            <Flex gap={1} justifyContent="space-between" flexDir="row" alignItems="center">
              <Text
                onPress={() =>
                  navigation.navigate("Employee Profile", {
                    employeeId: employeeId,
                    loggedEmployeeId: loggedEmployeeId,
                    loggedEmployeeImage: loggedEmployeeImage,
                    refetchPost: refetchPost,
                    forceRerender: forceRerender,
                    setForceRerender: setForceRerender,
                  })
                }
                fontSize={15}
                fontWeight={500}
              >
                {employeeName.length > 30 ? employeeName.split(" ")[0] : employeeName}
              </Text>
              {type === "Announcement" ? (
                <Badge borderRadius={15} backgroundColor="#ADD7FF">
                  <Text fontSize={10}>Announcement</Text>
                </Badge>
              ) : null}
            </Flex>
            <Text fontSize={12} fontWeight={400} color="#8A9099">
              {dayjs(createdAt).format("MMM DD, YYYY")}
            </Text>
          </Flex>
        </Flex>

        <Text fontSize={12} fontWeight={500}>
          {styledTexts}
        </Text>

        {attachment ? (
          <>
            <TouchableOpacity key={id} onPress={toggleFullScreen}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}/thumb` }}
                borderRadius={15}
                width="100%"
                height={200}
                alt="Feed Image"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Modal backgroundColor="#000000" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
              <Modal.Content backgroundColor="#000000">
                <Modal.CloseButton />
                <Modal.Body alignContent="center">
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}/thumb` }}
                    height={500}
                    width={500}
                    alt="Feed Image"
                    resizeMode="contain"
                  />
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        ) : null}

        {/* {styledTexts.filter((item) => {
          if (item?.props?.children[0].includes("youtube") === true) {
            return (
              <Flex>
                <YouTubeEmbed url={item?.props?.children[0]} width={300} height={200} />;
              </Flex>
            );
          } else if (item?.props?.children[0].includes("twitter") === true) {
            <Flex>
              <TwitterEmbed url={item?.props?.children[0]} width={250} />;
            </Flex>;
          }
        })} */}

        <Flex alignItems="center" direction="row" gap={4}>
          <Flex alignItems="center" direction="row" gap={2}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialCommunityIcons name="heart" />} size="md" fill="#FD7972" />
              </Pressable>
            )}
            {likeAction === "like" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialCommunityIcons name="heart-outline" />} size="md" color="#8A9099" />
              </Pressable>
            )}

            <Text fontSize={15} fontWeight={500}>
              {totalLike}
            </Text>
          </Flex>
          <Flex alignItems="center" direction="row" gap={2}>
            <Pressable
              onPress={() => {
                onCommentToggle(id);
              }}
            >
              <Icon as={<MaterialCommunityIcons name="comment-text-outline" />} size="md" color="#8A9099" />
            </Pressable>
            <Text fontSize={15} fontWeight={500}>
              {totalComment}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FeedCardItem;

const styles = StyleSheet.create({
  defaultText: {
    color: "black",
  },
  highlightedText: {
    color: "#72acdc",
  },
});
