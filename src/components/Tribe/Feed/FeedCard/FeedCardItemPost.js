import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Pressable, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";

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
  forceRerender,
  setForceRerender,
  toggleFullScreen,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  employeeUsername,
  navigation,
  reference,
}) => {
  const [totalLike, setTotalLike] = useState(total_like);
  const [likeAction, setLikeAction] = useState("dislike");

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
    setForceRerender(!forceRerender);
  };

  const words = content?.split(" ");

  /**
   * Handle styled for content
   */
  const contentStyledTextHandler = words?.map((item, index) => {
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
      <View
        style={{
          padding: 16,
          gap: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "#FFFFFF",
          elevation: 1,
        }}
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
              <Text style={[{}, TextProps]}>
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

        <Text style={[{ fontSize: 14 }, TextProps]}>{contentStyledTextHandler}</Text>

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
            <Text style={[{ fontSize: 14 }, TextProps]}>{totalComment}</Text>
            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
              {" "}
              {totalComment > 1 ? "Comments" : "Comment"}
            </Text>
            {/* <Pressable
              onPress={() => {
                onCommentToggle(id);
              }}
            >
              <MaterialCommunityIcons name="comment-text-outline" size={20} color="#3F434A" />
            </Pressable> */}
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
    // flex: 1,
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
