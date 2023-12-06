import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";

import { Flex, Image, Text, Icon, Pressable, Badge } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";

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
  forceRerender,
  setForceRerender,
  toggleFullScreen,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  postRefetchHandler,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [likeAction, setLikeAction] = useState("dislike");

  const navigation = useNavigation();

  /**
   * Like post control
   */

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

  const words = content?.split(" ");
  const styledTexts = words?.map((item, index) => {
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
                postRefetch: postRefetchHandler,
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
                    postRefetch: postRefetchHandler,
                  })
                }
                fontSize={15}
                fontWeight={500}
              >
                {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
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
            <TouchableOpacity key={id} onPress={() => attachment && toggleFullScreen(attachment)}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}` }}
                borderRadius={15}
                width="100%"
                height={250}
                alt="Feed Image"
                resizeMode="contain"
                resizeMethod="auto"
                fadeDuration={0}
              />
            </TouchableOpacity>
          </>
        ) : null}

        <Flex alignItems="center" direction="row" gap={4}>
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
          <Flex alignItems="center" direction="row" gap={2}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialCommunityIcons name="heart" />} size="md" color="#FF0000" />
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
