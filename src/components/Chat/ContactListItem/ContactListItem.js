import { useEffect, useState } from "react";

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import axiosInstance from "../../../config/api";
import SlideContactItem from "./SlideContactItem";
import ContactSlideAction from "./ContactSlideAction";

const ContactListItem = ({
  chat,
  type,
  id,
  userId,
  name,
  image,
  position,
  email,
  message,
  isDeleted,
  fileName,
  project,
  task,
  time,
  timestamp,
  searchKeyword,
  active_member,
  isRead,
  isPinned,
  onClickMore,
  onPin,
  navigation,
  latest,
  userSelector,
}) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  const params = {
    userId: userId,
    name: name,
    roomId: id,
    image: image,
    position: position,
    email: email,
    type: type,
    active_member: active_member,
    isPinned: isPinned,
    forwardedMessage: null,
  };

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${id}/member`);
      setSelectedGroupMembers(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle for mention name in group member
   */
  const memberName = selectedGroupMembers.map((item) => {
    return item?.user?.name;
  });

  /**
   * Handle showing mention chat
   */
  for (let i = 0; i < memberName.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    message = message?.replace(placeholder, `@${memberName[i]}`);
  }

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence?.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderName = () => {
    return boldMatchCharacters(name, searchKeyword);
  };

  const generateIcon = () => {
    let iconName = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        iconName = "image";
      } else {
        iconName = "file-document";
      }
    }
    if (project) {
      iconName = "lightning-bolt";
    }
    if (task) {
      iconName = "checkbox-marked-circle-outline";
    }
    return iconName;
  };

  const generateAttachmentText = () => {
    let text = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        text = "Photo";
      } else {
        text = "File";
      }
    }
    if (project) {
      text = "Project";
    }
    if (task) {
      text = "Task";
    }
    return text;
  };

  const translateX = useSharedValue(0);
  const swipeThresholdPositive = 150;
  const swipeThresholdNegative = -150;
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > 0) {
        const dismissed = translateX.value < swipeThresholdPositive;
        if (dismissed) {
          translateX.value = withTiming(0);
        } else {
          translateX.value = withTiming(70);
        }
      } else {
        const dismissed = translateX.value > swipeThresholdNegative;
        if (dismissed) {
          translateX.value = withTiming(0);
        } else {
          translateX.value = withTiming(-60);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: translateX.value > 0 ? "#377893" : "#959595",
  }));

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <>
      <Animated.View
        style={[
          animatedBackgroundStyle,
          {
            justifyContent: "center",
          },
        ]}
      >
        <ContactSlideAction
          translateX={translateX}
          onClickMore={onClickMore}
          onPin={onPin}
          type={type}
          id={id}
          isPinned={isPinned}
          chat={chat}
        />
        <SlideContactItem
          panGesture={panGesture}
          animatedStyle={animatedStyle}
          navigation={navigation}
          params={params}
          name={name}
          image={image}
          searchKeyword={searchKeyword}
          renderName={renderName}
          time={time}
          timestamp={timestamp}
          type={type}
          chat={chat}
          userSelector={userSelector}
          isDeleted={isDeleted}
          message={message}
          project={project}
          task={task}
          fileName={fileName}
          generateIcon={generateIcon}
          isRead={isRead}
          latest={latest}
          isPinned={isPinned}
          generateAttachmentText={generateAttachmentText}
        />
      </Animated.View>
    </>
  );
};

export default ContactListItem;
