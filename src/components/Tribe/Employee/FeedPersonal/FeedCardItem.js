import { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Text,
  Image,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

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
  toggleDeleteModal,
  toggleEditModal,
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
    setForceRerenderPersonal(!forceRerenderPersonal);
  };

  const words = content?.split(" ");
  const styledTexts = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    let specificEmployee;
    specificEmployee = employeeUsername?.find((employee) =>
      item?.includes(employee.username)
    );
    const hasTag = item.includes("<a");
    const hasHref = item.includes("href");

    if (item.includes("https")) {
      textStyle = styles.highlightedText;
      return (
        <Text
          key={index}
          style={textStyle}
          onPress={() => handleLinkPress(item)}
        >
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
        <Text
          key={index}
          style={textStyle}
          onPress={() => copyToClipboard(item)}
        >
          {item}{" "}
        </Text>
      );
    } else if (item.includes("@") && item.includes(".com")) {
      textStyle = styles.highlightedText;
      return (
        <Text
          key={index}
          style={textStyle}
          onPress={() => handleEmailPress(item)}
        >
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
      <Pressable
        gap={20}
        style={card.card}
        onPress={() => navigation.navigate("Post Screen", { id: id })}
      >
        <View style={styles.cardHeader}>
          <AvatarPlaceholder
            image={employeeImage}
            name={employeeName}
            size="lg"
            isThumb={false}
          />

          <View style={{ flex: 1, gap: 5 }}>
            <View style={styles.dockName}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={[{ fontSize: 14 }, TextProps]}>
                  {employeeName?.length > 30
                    ? employeeName?.split(" ")[0]
                    : employeeName}
                </Text>
                {type === "Announcement" ? (
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#ADD7FF",
                      padding: 5,
                    }}
                  >
                    <Text style={[{ fontSize: 10 }, TextProps]}>
                      Announcement
                    </Text>
                  </View>
                ) : null}
              </View>

              {loggedEmployeeId === employeeId && (
                <Pressable
                  style={{ marginRight: 1 }}
                  onPress={async () => {
                    await SheetManager.show("form-sheet", {
                      payload: {
                        children: (
                          <View
                            style={{
                              display: "flex",
                              gap: 21,
                              paddingHorizontal: 20,
                              paddingVertical: 16,
                              paddingBottom: -20,
                            }}
                          >
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
                                  toggleEditModal();
                                }}
                                style={{
                                  ...styles.containerEdit,
                                  justifyContent: "space-between",
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#FFFFFF",
                                }}
                              >
                                <Text style={[{ fontSize: 16 }, TextProps]}>
                                  Edit Post
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={async () => {
                                  await SheetManager.hide("form-sheet");
                                  toggleDeleteModal();
                                }}
                                style={{
                                  ...styles.containerEdit,
                                  justifyContent: "space-between",
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#FFFFFF",
                                }}
                              >
                                <Text
                                  style={[
                                    {
                                      fontSize: 16,
                                      fontWeight: "400",
                                      color: "#D64B4B",
                                    },
                                  ]}
                                >
                                  Delete Post
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ),
                      },
                    });
                    openSelectedPersonalPost(id);
                  }}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={20}
                    borderRadius={20}
                    color="#000000"
                  />
                </Pressable>
              )}
            </View>
            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
              {dayjs(createdAt).format("MMM DD, YYYY")}
            </Text>
          </View>
        </View>

        <Text style={[{ fontSize: 14 }, TextProps]}>{styledTexts}</Text>

        {attachment ? (
          <>
            <TouchableOpacity
              key={id}
              onPress={() => attachment && toggleFullScreen(attachment)}
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
            <Pressable
              onPress={() => {
                onCommentToggle(id);
              }}
            >
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={20}
                color="#3F434A"
              />
            </Pressable>
            <Text style={[{ fontSize: 14 }, TextProps]}>{totalComment}</Text>
          </View>
          <View style={styles.iconAction}>
            {likeAction === "dislike" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <MaterialCommunityIcons
                  name="heart"
                  size={20}
                  color="#FD7972"
                />
              </Pressable>
            )}
            {likeAction === "like" && (
              <Pressable onPress={() => toggleLikeHandler(id, likeAction)}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={20}
                  color="#3F434A"
                />
              </Pressable>
            )}

            <Text style={[{ fontSize: 14 }, TextProps]}>{totalLike}</Text>
          </View>
        </View>
      </Pressable>
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
    marginVertical: 14,
    marginBottom: 2,
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
    flex: 1,
    width: "100%",
    height: 350,
    backgroundColor: "white",
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
  },
});
