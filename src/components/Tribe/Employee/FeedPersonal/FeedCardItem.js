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
  forceRerenderPersonal,
  setForceRerenderPersonal,
  toggleFullScreen,
  handleLinkPress,
  openSelectedPersonalPost,
  employeeUsername,
  toggleDeleteModal,
  toggleEditModal,
  toggleReportModal,
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
      <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
        <TouchableOpacity
          onPress={async () => {
            await SheetManager.hide("form-sheet");
            toggleEditModal();
          }}
          style={styles.containerEdit}
        >
          <Text style={[{ fontSize: 16 }, TextProps]}>Edit</Text>
          <MaterialCommunityIcons name="file-edit" size={20} color="#176688" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await SheetManager.hide("form-sheet");
            toggleDeleteModal();
          }}
          style={styles.containerEdit}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#EB0E29" }}>Delete</Text>
          <MaterialCommunityIcons name="trash-can-outline" color="#EB0E29" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActionReport = () => {
    <View style={styles.wrapper}>
      <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
        <TouchableOpacity
          onPress={async () => {
            await SheetManager.hide("form-sheet");
            toggleReportModal();
          }}
          style={styles.containerEdit}
        >
          <Text style={[{ fontSize: 16 }, TextProps]}>Report</Text>
          <MaterialCommunityIcons name="alert-box" size={20} color="#176688" />
        </TouchableOpacity>
      </View>
    </View>;
  };

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
    setForceRerenderPersonal(!forceRerenderPersonal);
  };

  useEffect(() => {
    if (likedBy && likedBy.includes("'" + String(loggedEmployeeId) + "'")) {
      setLikeAction("dislike");
    } else {
      setLikeAction("like");
    }
  }, [likedBy, loggedEmployeeId]);

  return (
    <Pressable
      style={[card.card, { gap: 20, marginVertical: 4 }]}
      onPress={() => navigation.navigate("Post Screen", { id: id })}
    >
      <View style={styles.cardHeader}>
        <AvatarPlaceholder image={employeeImage} name={employeeName} size="lg" isThumb={false} />

        <View style={{ flex: 1, gap: 5 }}>
          <View style={styles.dockName}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={[{ fontSize: 14 }, TextProps]}>
                {employeeName?.length > 30 ? employeeName?.split(" ")[0] : employeeName}
              </Text>
              {type === "Announcement" && (
                <View style={{ borderRadius: 10, backgroundColor: "#ADD7FF", padding: 5 }}>
                  <Text style={[{ fontSize: 10 }, TextProps]}>Announcement</Text>
                </View>
              )}
            </View>

            {loggedEmployeeId === employeeId && (
              <MaterialCommunityIcons
                onPress={async () => {
                  await SheetManager.show("form-sheet", {
                    payload: {
                      children: renderActionOptions(),
                    },
                  });
                  openSelectedPersonalPost(id);
                }}
                name="dots-vertical"
                size={20}
                borderRadius={20}
                color="#000000"
                style={{ marginRight: 1 }}
              />
            )}
            {/* {loggedEmployeeId !== employeeId && (
              <MaterialCommunityIcons
                onPress={async () => {
                  await SheetManager.show("form-sheet", {
                    payload: {
                      children: renderActionReport(),
                    },
                  });
                  onToggleReport(id);
                }}
                name="dots-vertical"
                size={20}
                borderRadius={20}
                color="#000000"
                style={{ marginRight: 1 }}
              />
            )} */}
          </View>
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
            onPressLink={handleLinkPress}
          />
        }
      </Text>

      {attachment ? (
        <>
          <TouchableOpacity
            key={id}
            onPress={() =>
              attachment && toggleFullScreen(attachment, isFullScreen, setIsFullScreen, setSelectedPicture)
            }
          >
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_API}/image/${attachment}`,
              }}
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
              color="#FD7972"
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

          <Text style={[{ fontSize: 14 }, TextProps]}>{totalLike}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default FeedCardItem;

const styles = StyleSheet.create({
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
    flex: 1,
    width: "100%",
    height: 350,
    backgroundColor: "#FFFFFF",
    resizeMode: "cover",
  },
  containerEdit: {
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
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
});
