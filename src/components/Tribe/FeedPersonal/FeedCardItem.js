import { useEffect, useState } from "react";
import dayjs from "dayjs";

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
  refetchPersonalPost,
  forceRerenderPersonal,
  setForceRerenderPersonal,
  toggleFullScreen,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  openSelectedPersonalPost,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [filteredContent, setFilteredContent] = useState(null);
  const [likeAction, setLikeAction] = useState("dislike");

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
    setForceRerenderPersonal(!forceRerenderPersonal);
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
          <AvatarPlaceholder image={employeeImage} name={employeeName} size={10} isThumb={false} />

          <Flex flex={1}>
            <Flex gap={1} justifyContent="space-between" flexDir="row" alignItems="center">
              <Text fontSize={15} fontWeight={500}>
                {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
              </Text>
              <Flex flexDir="row" alignItems="center" gap={1}>
                {type === "Announcement" ? (
                  <Badge borderRadius={15} backgroundColor="#ADD7FF">
                    <Text fontSize={10}>Announcement</Text>
                  </Badge>
                ) : null}
                {loggedEmployeeId === employeeId && (
                  <>
                    <Pressable onPress={() => openSelectedPersonalPost(id)}>
                      <Icon
                        as={<MaterialCommunityIcons name="dots-vertical" />}
                        size="md"
                        borderRadius="full"
                        color="#000000"
                      />
                    </Pressable>
                  </>
                )}
              </Flex>
            </Flex>
            <Text fontSize={12} fontWeight={400} color="#8A9099">
              {dayjs(createdAt).format("MMM DD, YYYY")}
            </Text>
          </Flex>
        </Flex>

        <Text onPress={() => contentClickHandler(filteredContent)} fontSize={12} fontWeight={500}>
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
              />
            </TouchableOpacity>
          </>
        ) : null}

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
