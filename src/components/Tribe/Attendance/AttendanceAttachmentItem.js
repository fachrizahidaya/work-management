import dayjs from "dayjs";

import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const AttendanceAttachmentItem = ({ file_path, title, begin_date, end_date, setAttachmentId, id }) => {
  return (
    <View style={styles.card}>
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank")}
      >
        <MaterialCommunityIcons name="file-outline" size={20} />
        <View style={{ gap: 3 }}>
          <Text style={[{ fontSize: 14 }, TextProps]}>{title}</Text>
          <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
            {dayjs(begin_date).format("DD MMM YYYY")} - {dayjs(end_date).format("DD MMM YYYY")}
          </Text>
        </View>
      </Pressable>

      <MaterialCommunityIcons name="trash-can-outline" size={20} onPress={() => setAttachmentId(id)} />
    </View>
  );
};

export default AttendanceAttachmentItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    elevation: 1,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 10,
  },
});
