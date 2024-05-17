import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Pressable, Text, Image } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

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
  onToggleFullScreen,
  onPressLink,
  employeeUsername,
  navigation,
  reference,
  setPostId,
  isFullScreen,
  setIsFullScreen,
  setSelectedPicture,
  onToggleReport,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [likeAction, setLikeAction] = useState("dislike");

  const words = content?.split(" ");

  const renderActionOptions = () => (
    <View style={styles.wrapper}>
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            await SheetManager.hide("form-sheet");
            onToggleReport(id);
          }}
          style={styles.containerReport}
        >
          <Text style={[{ fontSize: 16 }, TextProps]}>Report</Text>
          <MaterialCommunityIcons name="alert-box" size={20} color="#176688" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
  };

  useEffect(() => {
    if (likedBy && likedBy?.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <View
      style={{
        ...card.card,
        ...styles.card,
      }}
    >
      <Pressable style={styles.card} onPress={() => navigation.navigate("Post Screen", { id: id })}>
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
          <MaterialCommunityIcons
            onPress={async () => {
              await SheetManager.show("form-sheet", {
                payload: {
                  children: renderActionOptions(),
                },
              });
            }}
            name="dots-vertical"
            size={20}
            borderRadius={20}
            color="#000000"
            style={{ marginRight: 1 }}
          />
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
      </Pressable>

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
          <MaterialCommunityIcons
            onPress={() => {
              onCommentToggle(id, reference, setPostId);
            }}
            name="comment-text-outline"
            size={20}
            color="#3F434A"
          />
          <Text style={[{ fontSize: 14 }, TextProps]}>{totalComment}</Text>
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
      </View>
    </View>
  );
};

export default FeedCardItem;

const styles = StyleSheet.create({
  card: {
    gap: 20,
    flexDirection: "column",
    marginVertical: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  containerReport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
});
