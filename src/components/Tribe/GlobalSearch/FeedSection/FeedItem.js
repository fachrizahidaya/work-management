import dayjs from "dayjs";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../../shared/CustomStylings";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FeedContentStyle from "../../../shared/FeedContentStyle";

const FeedItem = ({
  id,
  employee_image,
  employee_name,
  created_at,
  content,
  employeeUsername,
  navigation,
  file_path,
  total_comment,
  total_like,
  type,
}) => {
  return (
    <Pressable style={styles.item} onPress={() => navigation.navigate("Post Screen", { id: id })}>
      <View style={styles.cardHeader}>
        <AvatarPlaceholder image={employee_image} name={employee_name} size="lg" isThumb={false} />

        <View style={{ flex: 1, gap: 5 }}>
          <View style={styles.dockName}>
            <Text style={[{ fontSize: 14 }, TextProps]}>
              {employee_name?.length > 30 ? employee_name?.split(" ")[0] : employee_name}
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
          </View>
          <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>{dayjs(created_at).format("MMM DD, YYYY")}</Text>
        </View>
      </View>

      <Text style={[{ fontSize: 14 }, TextProps]}>
        {
          <FeedContentStyle
            words={content?.split(" ")}
            employeeUsername={employeeUsername}
            navigation={navigation}
            loggedEmployeeId={null}
            loggedEmployeeImage={null}
            handleLinkPress={null}
          />
        }
      </Text>

      {file_path ? (
        <View>
          <Image
            style={styles.image}
            source={{
              uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}`,
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
            <MaterialCommunityIcons name="comment-text-outline" size={20} color="#3F434A" />
          </Pressable>
          <Text style={[{ fontSize: 14 }, TextProps]}>{total_comment}</Text>
        </View>
        <View style={styles.iconAction}>
          {total_like ? (
            <Pressable>
              <MaterialCommunityIcons name="heart" size={20} color="#FF0000" />
            </Pressable>
          ) : (
            <Pressable>
              <MaterialCommunityIcons name="heart-outline" size={20} color="#3F434A" />
            </Pressable>
          )}

          <Text style={[{ fontSize: 14 }, TextProps]}>{total_like}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default FeedItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#ffffff",
    gap: 20,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginBottom: 4,
    elevation: 1,
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
