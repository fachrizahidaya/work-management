import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Icon, Badge } from "native-base";
import { StyleSheet, TouchableOpacity, View, Pressable, Text, Image } from "react-native";

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
    <View style={styles.container}>
      <View gap={20} style={card.card}>
        <View style={styles.cardHeader}>
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

          <View style={styles.nameContainer}>
            <TouchableOpacity style={styles.dockName}>
              <Text
                style={styles.name}
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
                  <Text style={styles.announcement}>Announcement</Text>
                </Badge>
              ) : null}
            </TouchableOpacity>
            <Text style={styles.date}>{dayjs(createdAt).format("MMM DD, YYYY")}</Text>
          </View>
        </View>

        <Text style={styles.content}>{styledTexts}</Text>

        {attachment ? (
          <TouchableOpacity key={id} onPress={() => attachment && toggleFullScreen(attachment)}>
            <Image
              style={styles.image}
              source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}` }}
              alt="Feed Image"
              resizeMethod="auto"
              fadeDuration={0}
            />
          </TouchableOpacity>
        ) : null}

        <View style={styles.dockAction}>
          <View style={styles.iconAction}>
            <Pressable
              onPress={() => {
                onCommentToggle(id);
              }}
            >
              <Icon as={<MaterialCommunityIcons name="comment-text-outline" />} size="md" color="#8A9099" />
            </Pressable>
            <Text style={styles.comment}>{totalComment}</Text>
          </View>
          <View style={styles.iconAction}>
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

            <Text style={styles.like}>{totalLike}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeedCardItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: 5,
  },
  defaultText: {
    color: "black",
  },
  highlightedText: {
    color: "#72acdc",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  nameContainer: {
    flex: 1,
    gap: 5,
  },
  dockName: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 1,
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
    gap: 20,
  },
  iconAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "400",
  },
  announcement: {
    fontSize: 10,
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.5,
  },
  content: {
    fontSize: 12,
    fontWeight: "500",
  },
  comment: {
    fontSize: 15,
    fontWeight: "500",
  },
  like: {
    fontSize: 15,
    fontWeight: "500",
  },
});
