import { Avatar, Box, Flex, Image, Text, ScrollView, Skeleton, Icon, Pressable, Modal } from "native-base";
import { useEffect, useState } from "react";
import { card } from "../../../styles/Card";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

const FeedCardItem = ({
  id,
  employee_name,
  created_at,
  employee_image,
  content,
  total_like,
  total_comment,
  liked_by,
  attachment,
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
    if (liked_by && liked_by.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [liked_by, loggedEmployeeId]);

  return (
    <Flex flexDir="column" style={card.card} my={5}>
      <Flex flex={1} gap={8} style={card.card}>
        <Box flex={1} minHeight={2}>
          <Flex direction="row" gap={4}>
            <AvatarPlaceholder image={employee_image} name={employee_name} size="md" />
            <Box>
              <Text fontSize={18} fontWeight={700}>
                {employee_name.length > 30 ? employee_name.split(" ")[0] : employee_name}
              </Text>
              <Text fontSize={12}>{dayjs(created_at).format("MMM DD, YYYY")}</Text>
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
            <Text>{total_comment}</Text>
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
