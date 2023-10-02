import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { Box, Flex, Image, Text, Icon, Pressable, Modal, Badge } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";

const FeedCardItem = ({
  id,
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
  onOpen,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [postIsFetching, setPostIsFetching] = useState(false);

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
  };

  /**
   *
   * Control for fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (likedBy && likedBy.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <Flex flexDir="column" mb={3}>
      <Flex gap={5} style={card.card}>
        <Flex alignItems="center" direction="row" gap={3}>
          <AvatarPlaceholder image={employeeImage} name={employeeName} size={10} />
          <Flex flex={1}>
            <Flex gap={1} justifyContent="space-between" flexDir="row" alignItems="center">
              <Text fontSize={15} fontWeight={500}>
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

        <Text fontSize={12} fontWeight={500} color="#595F69">
          {content}
        </Text>

        {attachment ? (
          <>
            <TouchableOpacity key={id} onPress={toggleFullScreen}>
              <Image
                source={{ uri: `https://dev.kolabora-app.com/api-dev/image/${attachment}/thumb` }}
                borderRadius={15}
                height={200}
                alt="Feed Image"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Modal backgroundColor="black" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
              <Modal.Content backgroundColor="black">
                <Modal.CloseButton />
                <Modal.Body alignContent="center">
                  <Image
                    source={{ uri: `https://dev.kolabora-app.com/api-dev/image/${attachment}/thumb` }}
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

        <Flex alignItems="center" direction="row" gap={4}>
          <Flex alignItems="center" direction="row" gap={2}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialIcons name="favorite" />} size="md" fill="#FD7972" />
              </Pressable>
            )}
            {likeAction === "like" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialIcons name="favorite-outline" />} size="md" color="#8A9099" />
              </Pressable>
            )}

            <Text fontSize={15} fontWeight={500}>
              {totalLike}
            </Text>
          </Flex>
          <Flex alignItems="center" direction="row" gap={2}>
            <Pressable onPress={() => onCommentToggle(id)}>
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
