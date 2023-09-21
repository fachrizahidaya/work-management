import { Box, Flex, Image, Text, Icon, Pressable, Modal, Badge } from "native-base";
import { useEffect, useState } from "react";
import { card } from "../../../styles/Card";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { StyleSheet, TouchableOpacity } from "react-native";

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
}) => {
  const [likeAction, setLikeAction] = useState("dislike");
  const [totalLike, setTotalLike] = useState(total_like);
  const [postIsFetching, setPostIsFetching] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    <Flex flexDir="column" style={card.card} my={5}>
      <Flex flex={1} gap={8} style={card.card}>
        <Box flex={1} minHeight={2}>
          <Flex direction="row" gap={4}>
            <AvatarPlaceholder image={employeeImage} name={employeeName} size="md" />
            <Box>
              <Flex gap={1} alignItems="center" justifyContent="center" flexDir="row">
                <Text fontSize={18} fontWeight={700}>
                  {employeeName.length > 30 ? employeeName.split(" ")[0] : employeeName}
                </Text>
                {type === "Announcement" ? <Icon as={<MaterialIcons name="campaign" />} color="black" /> : null}
              </Flex>
              <Flex flexDir="row">
                <Text fontSize={12}>{dayjs(createdAt).format("MMM DD, YYYY")}</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        {/* if picture not available, it will not show alt props */}
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
        <Text color="muted.500">{content}</Text>
        <Flex direction="row" gap={4}>
          <Flex direction="row" gap={2}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialIcons name="favorite" />} size="md" fill="red" />
              </Pressable>
            )}
            {likeAction === "like" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <Icon as={<MaterialIcons name="favorite-outline" />} size="md" color="black" />
              </Pressable>
            )}
            <Text>{totalLike}</Text>
          </Flex>
          <Flex direction="row" gap={2}>
            <Pressable onPress={() => onCommentToggle(id)}>
              <Icon as={<MaterialCommunityIcons name="comment-text-outline" />} size="md" color="black" />
            </Pressable>
            <Text>{totalComment}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
});

export default FeedCardItem;
