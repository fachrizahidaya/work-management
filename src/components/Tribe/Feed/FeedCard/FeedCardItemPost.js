import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";
import FeedContentStyle from "../../../shared/FeedContentStyle";

const FeedCardItemPost = ({
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
  onToggleFullScreen,
  onPressLink,
  employeeUsername,
  navigation,
  reference,
  isFullScreen,
  setIsFullScreen,
  setSelectedPicture,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [likeAction, setLikeAction] = useState("dislike");

  const words = content?.split(" ");

  const params = {
    employeeId: employeeId,
    loggedEmployeeId: loggedEmployeeId,
    loggedEmployeeImage: loggedEmployeeImage,
  };

  /**
   * Handle toggle like post
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
  };

  useEffect(() => {
    if (likedBy && likedBy.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => navigation.navigate("Employee Profile", params)}>
            <AvatarPlaceholder image={employeeImage} name={employeeName} size="lg" isThumb={false} />
          </TouchableOpacity>

          <View style={{ flex: 1, gap: 5 }}>
            <TouchableOpacity style={styles.dockName} onPress={() => navigation.navigate("Employee Profile", params)}>
              <Text style={[TextProps]}>{employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}</Text>
              {type === "Announcement" ? (
                <View style={{ borderRadius: 10, backgroundColor: "#ADD7FF", padding: 5 }}>
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
              onPressLink={onPressLink}
            />
          }
        </Text>

        {attachment ? (
          <TouchableOpacity
            key={id}
            onPress={() =>
              attachment && onToggleFullScreen(attachment, isFullScreen, setIsFullScreen, setSelectedPicture)
            }
          >
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
            <Text style={[{ fontSize: 14 }, TextProps]}>{totalComment}</Text>
            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
              {" "}
              {totalComment > 1 ? "Comments" : "Comment"}
            </Text>
          </View>
          <View style={styles.iconAction}>
            {likeAction === "dislike" && (
              <MaterialCommunityIcons
                onPress={() => toggleLikeHandler(id, likeAction)}
                name="heart"
                size={20}
                color="#FF0000"
              />
            )}
            {likeAction === "like" && (
              <MaterialCommunityIcons
                onPress={() => toggleLikeHandler(id, likeAction)}
                name="heart-outline"
                size={20}
                color="#3F434A"
              />
            )}

            <Text style={[{ fontSize: 14 }, TextProps]}>{totalLike || total_like}</Text>
          </View>
          {/* <View style={styles.iconAction}>
            <TouchableOpacity onPress={() => reference.current?.show()}>
              <MaterialCommunityIcons name="share-variant" size={20} color="#3F434A" />
            </TouchableOpacity>

            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}> Share</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default FeedCardItemPost;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: 14,
    marginBottom: 0,
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
    backgroundColor: "#FFFFFF",
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
  wrapper: {
    padding: 16,
    gap: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 1,
  },
});
