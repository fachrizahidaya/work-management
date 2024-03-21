import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Pressable, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";
import FeedContentStyle from "../../../shared/FeedContentStyle";

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
  employeeUsername,
  navigation,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [likeAction, setLikeAction] = useState("dislike");

  const words = content?.split(" ");

  /**
   * Handle toggle like
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

  useEffect(() => {
    if (likedBy && likedBy.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <TouchableOpacity
      style={{
        ...card.card,
        gap: 20,
        flexDirection: "column",
        marginVertical: 8,
        elevation: 1,
      }}
      onPress={() => navigation.navigate("Post Screen", { id: id })}
    >
      <View style={styles.cardHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Employee Profile", {
              employeeId: employeeId,
              loggedEmployeeId: loggedEmployeeId,
              loggedEmployeeImage: loggedEmployeeImage,
            })
          }
        >
          <AvatarPlaceholder image={employeeImage} name={employeeName} size="lg" isThumb={false} />
        </TouchableOpacity>

        <View style={{ flex: 1, gap: 5 }}>
          <TouchableOpacity
            style={styles.dockName}
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: employeeId,
                loggedEmployeeId: loggedEmployeeId,
                loggedEmployeeImage: loggedEmployeeImage,
              })
            }
          >
            <Text style={[{ fontSize: 14 }, TextProps]}>
              {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
            </Text>
            {type === "Announcement" ? (
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "#ADD7FF",
                  padding: 5,
                }}
              >
                <Text style={[{ fontSize: 10 }, TextProps]}>Announcement</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>{dayjs(createdAt).format("MMM DD, YYYY")}</Text>
        </View>
      </View>

      <Text style={[{ fontSize: 14 }, TextProps]}>
        {
          <FeedContentStyle
            words={words}
            employeeUsername={employeeUsername}
            navigation={navigation}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            handleLinkPress={handleLinkPress}
          />
        }
      </Text>

      {attachment ? (
        <TouchableOpacity key={id} onPress={() => attachment && toggleFullScreen(attachment)}>
          <Image
            style={styles.image}
            source={{
              uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}`,
            }}
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
            <MaterialCommunityIcons name="comment-text-outline" size={20} color="#3F434A" />
          </Pressable>
          <Text style={[{ fontSize: 14 }, TextProps]}>{totalComment}</Text>
        </View>
        <View style={styles.iconAction}>
          {likeAction === "dislike" && (
            <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
              <MaterialCommunityIcons name="heart" size={20} color="#FF0000" />
            </Pressable>
          )}
          {likeAction === "like" && (
            <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
              <MaterialCommunityIcons name="heart-outline" size={20} color="#3F434A" />
            </Pressable>
          )}

          <Text style={[{ fontSize: 14 }, TextProps]}>{totalLike || total_like}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  image: {
    width: "100%",
    height: 250,
    backgroundColor: "white",
    resizeMode: "cover",
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
});
