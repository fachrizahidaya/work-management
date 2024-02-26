import React from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";

const FeedSection = ({ feed, employeeUsername }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>POSTS</Text>

      <View
        style={{
          paddingHorizontal: 14,
          backgroundColor: "#f8f8f8",
          borderRadius: 15,
        }}
      >
        {feed.map((item) => {
          const words = item?.content?.split(" ");
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
                <Text key={index} style={textStyle}>
                  {item}{" "}
                </Text>
              );
            } else if (hasHref && specificEmployee) {
              item = specificEmployee.username;
              textStyle = styles.highlightedText;
              return (
                <Text key={index} style={textStyle}>
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
                <Text key={index} style={textStyle}>
                  {item}{" "}
                </Text>
              );
            } else if (item.includes("@") && item.includes(".com")) {
              textStyle = styles.highlightedText;
              return (
                <Text key={index} style={textStyle}>
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

          return (
            <Pressable
              style={styles.item}
              key={item?.id}
              onPress={() =>
                navigation.navigate("Post Screen", { id: item?.id })
              }
            >
              <View style={styles.cardHeader}>
                <AvatarPlaceholder
                  image={item?.employee_image}
                  name={item?.employee_name}
                  size="lg"
                  isThumb={false}
                />

                <View style={{ flex: 1, gap: 5 }}>
                  <View style={styles.dockName}>
                    <Text style={[{ fontSize: 14 }, TextProps]}>
                      {item?.employee_name?.length > 30
                        ? item?.employee_name?.split(" ")[0]
                        : item?.employee_name}
                    </Text>
                    {item?.type === "Announcement" ? (
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
                  <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                    {dayjs(item?.created_at).format("MMM DD, YYYY")}
                  </Text>
                </View>
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>{styledTexts}</Text>

              {item?.file_path ? (
                <View key={item?.id}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API}/image/${item?.file_path}`,
                    }}
                    alt="Feed Image"
                    resizeMethod="auto"
                    fadeDuration={0}
                  />
                </View>
              ) : null}

              <View style={styles.dockAction}>
                <View style={styles.iconAction}>
                  <Pressable>
                    <MaterialCommunityIcons
                      name="comment-text-outline"
                      size={20}
                      color="#3F434A"
                    />
                  </Pressable>
                  <Text style={[{ fontSize: 14 }, TextProps]}>
                    {item?.total_comment}
                  </Text>
                </View>
                <View style={styles.iconAction}>
                  {item?.total_like ? (
                    <Pressable>
                      <MaterialCommunityIcons
                        name="heart"
                        size={20}
                        color="#FF0000"
                      />
                    </Pressable>
                  ) : (
                    <Pressable>
                      <MaterialCommunityIcons
                        name="heart-outline"
                        size={20}
                        color="#3F434A"
                      />
                    </Pressable>
                  )}

                  <Text style={[{ fontSize: 14 }, TextProps]}>
                    {item?.total_like}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default FeedSection;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffffff",
    gap: 10,
  },
  icon: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#E8E9EB",
  },
  item: {
    display: "flex",
    gap: 20,
    borderColor: "black",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    marginVertical: 14,
    marginBottom: 4,
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
    flex: 1,
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
  defaultText: {
    color: "#000000",
  },
  highlightedText: {
    color: "#72acdc",
  },
});
