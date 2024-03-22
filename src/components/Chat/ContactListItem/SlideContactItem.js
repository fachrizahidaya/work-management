import React from "react";
import RenderHtml from "react-native-render-html";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TextProps } from "../../shared/CustomStylings";

const SlideContactItem = ({
  panGesture,
  animatedStyle,
  navigation,
  params,
  name,
  image,
  searchKeyword,
  renderName,
  time,
  timestamp,
  type,
  chat,
  userSelector,
  isDeleted,
  message,
  project,
  task,
  fileName,
  generateIcon,
  isRead,
  latest,
  isPinned,
  generateAttachmentText,
}) => {
  return (
    <PanGestureHandler onGestureEvent={panGesture} failOffsetY={[-5, 5]} activeOffsetX={[-5, 5]}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={{ backgroundColor: "#FFFFFF" }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("Chat Room", params);
          }}
        >
          <View style={styles.contactBox}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {!searchKeyword ? (
                    <Text style={[{ fontSize: 14, fontWeight: "500" }]}>{name}</Text>
                  ) : (
                    <RenderHtml
                      contentWidth={400}
                      source={{
                        html: renderName(),
                      }}
                    />
                  )}
                  <View style={{ flexDirection: "row" }}>
                    <ChatTimeStamp time={time} timestamp={timestamp} />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    {type === "group" && chat?.latest_message ? (
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        {userSelector?.name === chat?.latest_message?.user?.name
                          ? "You"
                          : chat?.latest_message?.user?.name}
                        :{" "}
                      </Text>
                    ) : null}
                    {!isDeleted ? (
                      <>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            {message && (
                              <Text style={[{ fontSize: 12 }, TextProps]}>
                                {message.length > 40 ? message.slice(0, 40) + "..." : message}
                              </Text>
                            )}
                            {!message && (project || task || fileName) && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 3,
                                }}
                              >
                                <MaterialCommunityIcons name={generateIcon()} size={20} color="#3F434A" />
                                <Text style={[{ fontSize: 12 }, TextProps]}>{generateAttachmentText()}</Text>
                              </View>
                            )}
                          </View>
                          {!!isRead && (
                            <View
                              style={{
                                height: 25,
                                width: 25,
                                backgroundColor: "#FD7972",
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  textAlign: "center",
                                  color: "#FFFFFF",
                                }}
                              >
                                {isRead > 20 ? "20+" : isRead}
                              </Text>
                            </View>
                          )}
                        </View>
                      </>
                    ) : isDeleted && userSelector.id === latest?.user?.id ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="block-helper"
                          size={10}
                          style={{
                            opacity: 0.5,
                            transform: [{ rotate: "90deg" }],
                          }}
                          color="#3F434A"
                        />
                        <Text
                          style={[
                            {
                              fontSize: 12,
                              fontStyle: "italic",
                              opacity: 0.5,
                            },
                            TextProps,
                          ]}
                        >
                          You deleted this message
                        </Text>
                      </View>
                    ) : isDeleted && userSelector.id !== latest?.user?.id ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="block-helper"
                          size={10}
                          style={{
                            opacity: 0.5,
                            transform: [{ rotate: "90deg" }],
                          }}
                          color="#3F434A"
                        />
                        <Text
                          style={[
                            {
                              fontSize: 12,
                              fontStyle: "italic",
                              opacity: 0.5,
                            },
                            TextProps,
                          ]}
                        >
                          This message was deleted
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  {isPinned?.pin_chat ? (
                    <MaterialCommunityIcons
                      name="pin"
                      size={20}
                      style={{ transform: [{ rotate: "45deg" }] }}
                      color="#3F434A"
                    />
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SlideContactItem;

const styles = StyleSheet.create({
  contactBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
