import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Pressable, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { card } from "../../../../styles/Card";

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
  forceRerenderPersonal,
  setForceRerenderPersonal,
  toggleFullScreen,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  openSelectedPersonalPost,
  employeeUsername,
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
    setForceRerenderPersonal(!forceRerenderPersonal);
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
          <AvatarPlaceholder image={employeeImage} name={employeeName} size={10} isThumb={false} />

          <View style={{ flex: 1, gap: 5 }}>
            <View style={styles.dockName}>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
              </Text>

              {type === "Announcement" ? (
                <View style={{ borderRadius: 15, backgroundColor: "#ADD7FF", padding: 5 }}>
                  <Text style={{ fontSize: 10 }}>Announcement</Text>
                </View>
              ) : null}
              {loggedEmployeeId === employeeId && (
                <>
                  <Pressable onPress={() => openSelectedPersonalPost(id)}>
                    <MaterialCommunityIcons name="dots-vertical" size={20} borderRadius={20} color="#000000" />
                  </Pressable>
                </>
              )}
            </View>
            <Text style={styles.date}>{dayjs(createdAt).format("MMM DD, YYYY")}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, fontWeight: "500" }}>{styledTexts}</Text>

        {attachment ? (
          <>
            <TouchableOpacity key={id} onPress={() => attachment && toggleFullScreen(attachment)}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}` }}
                style={styles.image}
                alt="Feed Image"
                resizeMethod="auto"
                fadeDuration={0}
              />
            </TouchableOpacity>
          </>
        ) : null}

        <View style={styles.dockAction}>
          <View style={styles.iconAction}>
            <Pressable
              onPress={() => {
                onCommentToggle(id);
              }}
            >
              <MaterialCommunityIcons name="comment-text-outline" size={20} color="#8A9099" />
            </Pressable>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>{totalComment}</Text>
          </View>
          <View style={styles.iconAction}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <MaterialCommunityIcons name="heart" size={20} color="#FD7972" />
              </Pressable>
            )}
            {likeAction === "like" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <MaterialCommunityIcons name="heart-outline" size={20} color="#8A9099" />
              </Pressable>
            )}

            <Text style={{ fontSize: 15, fontWeight: "500" }}>{totalLike}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeedCardItem;

const styles = StyleSheet.create({
  defaultText: {
    color: "#000000",
  },
  highlightedText: {
    color: "#72acdc",
  },
  container: {
    flexDirection: "column",
    marginVertical: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dockName: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 1,
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
  image: {
    borderRadius: 15,
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.5,
  },
});
