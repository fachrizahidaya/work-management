import React from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";

const FeedSection = ({ feed }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>PROJECTS</Text>

      {feed.map((item) => (
        <Pressable
          style={styles.item}
          key={item?.id}
          //   onPress={() => navigation.navigate("Project Detail", { id: item.id })}
        >
          <View style={styles.cardHeader}>
            <AvatarPlaceholder image={item?.employee_image} name={item?.employee_name} size="lg" isThumb={false} />

            <View style={{ flex: 1, gap: 5 }}>
              <View style={styles.dockName}>
                <Text style={[{ fontSize: 14 }, TextProps]}>
                  {item?.employee_name?.length > 30 ? item?.employee_name?.split(" ")[0] : item?.employee_name}
                </Text>
                {item?.type === "Announcement" ? (
                  <View style={{ borderRadius: 10, backgroundColor: "#ADD7FF", padding: 5 }}>
                    <Text style={[{ fontSize: 10 }, TextProps]}>Announcement</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                {dayjs(item?.created_at).format("MMM DD, YYYY")}
              </Text>
            </View>
          </View>
          <Text style={[{ fontSize: 14 }, TextProps]}>
            {
              // styledTexts
              item?.content
            }
          </Text>

          {item?.file_path ? (
            <View
              key={item?.id}
              //   onPress={() => attachment && toggleFullScreen(attachment)}
            >
              <Image
                style={styles.image}
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item?.file_path}` }}
                alt="Feed Image"
                resizeMethod="auto"
                fadeDuration={0}
              />
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
};

export default FeedSection;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
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
    gap: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#E9E9EB",
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
    height: 200,
    backgroundColor: "white",
    resizeMode: "cover",
  },
});
