import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";

import { Flex, Image, Text, Icon, Pressable, Modal, Badge, Actionsheet } from "native-base";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { YouTubeEmbed, TwitterEmbed } from "react-social-media-embed";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";

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
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [filteredContent, setFilteredContent] = useState(null);
  const [postIsFetching, setPostIsFetching] = useState(false);

  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

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
    setForceRerenderPersonal(!forceRerenderPersonal);
  };

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const words = content?.split(" ");
  const styledTexts = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    if (item.includes("https") || item.includes("www")) {
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
                    <Pressable onPress={toggleAction}>
                      <Icon
                        as={<MaterialCommunityIcons name="dots-vertical" />}
                        size="md"
                        borderRadius="full"
                        color="#000000"
                      />
                    </Pressable>
                    <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
                      <Actionsheet.Content>
                        <Actionsheet.Item onPress={toggleDeleteModal}>Delete Post</Actionsheet.Item>
                      </Actionsheet.Content>
                    </Actionsheet>
                    <ConfirmationModal
                      isOpen={deleteModalIsOpen}
                      toggle={toggleDeleteModal}
                      apiUrl={`/hr/posts/${id}`}
                      color="red.800"
                      hasSuccessFunc={true}
                      header="Cancel Leave Request"
                      onSuccess={() => {
                        toggleAction();
                        refetchPersonalPost();
                      }}
                      description="Are you sure to delete this post?"
                      successMessage="Post deleted"
                      isDelete={true}
                      isPatch={false}
                    />
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
            <TouchableOpacity key={id} onPress={toggleFullScreen}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}/thumb` }}
                borderRadius={15}
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
    color: "black", // Warna teks default
  },
  highlightedText: {
    color: "#72acdc", // Warna teks yang mengandung 'https' atau 'www'
  },
});
