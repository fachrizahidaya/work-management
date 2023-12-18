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
  forceRerender,
  setForceRerender,
  toggleFullScreen,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  employeeUsername,
  navigation,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
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
    setForceRerender(!forceRerender);
  };

  const words = content?.split(" ");
  const styledTexts = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    let specificEmployee;
    specificEmployee = employeeUsername?.find((employee) => item?.includes(employee.username));
    const hasTag = item.includes("<a");
    const hasHref = item.includes("href");

    if (item.includes("https")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
          {item}{" "}
        </Text>
      );
    } else if (hasHref && specificEmployee) {
      const specificEmployeeId = specificEmployee.id;
      item = specificEmployee.username;
      textStyle = styles.highlightedText;
      return (
        <Text
          key={index}
          style={textStyle}
          onPress={() =>
            navigation.navigate("Employee Profile", {
              employeeId: specificEmployeeId,
              loggedEmployeeId: loggedEmployeeId,
              loggedEmployeeImage: loggedEmployeeImage,
            })
          }
        >
          @{item}{" "}
        </Text>
      );
    } else if (hasTag) {
      item = item.replace(`<a`, "");
      textStyle = styles.defaultText;
      return <Text key={index}>{item}</Text>;
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
        <Flex style={styles.cardHeader} gap={3}>
          <Pressable
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: employeeId,
                loggedEmployeeId: loggedEmployeeId,
                loggedEmployeeImage: loggedEmployeeImage,
              })
            }
          >
            <AvatarPlaceholder image={employeeImage} name={employeeName} size={10} isThumb={false} />
          </Pressable>

          <Flex flex={1}>
            <Flex gap={1} style={styles.dockName}>
              <Text
                fontSize={15}
                fontWeight={500}
                onPress={() =>
                  navigation.navigate("Employee Profile", {
                    employeeId: employeeId,
                    loggedEmployeeId: loggedEmployeeId,
                    loggedEmployeeImage: loggedEmployeeImage,
                  })
                }
              >
                {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
              </Text>
              {type === "Announcement" ? (
                <Badge style={styles.announcementBadge}>
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
                style={styles.image}
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}` }}
                alt="Feed Image"
                resizeMethod="auto"
                fadeDuration={0}
              />
            </TouchableOpacity>
          </>
        ) : null}

        <Flex style={styles.dockAction} gap={4}>
          <Flex style={styles.iconAction} gap={2}>
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
          <Flex style={styles.iconAction} gap={2}>
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dockName: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  announcementBadge: {
    borderRadius: 15,
    backgroundColor: "#ADD7FF",
  },
  image: {
    borderRadius: 15,
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  dockAction: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconAction: {
    alignItems: "center",
    flexDirection: "row",
  },
});
