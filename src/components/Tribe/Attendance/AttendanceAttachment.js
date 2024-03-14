import dayjs from "dayjs";

import { View, Text, Pressable, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const AttendanceAttachment = ({ attachment, setAttachmentId, reference, attachmentIsFetching, refetchAttachment }) => {
  return (
    <View style={{ flex: 1, gap: 5, marginVertical: 15, paddingHorizontal: 16 }}>
      <View style={{ gap: 10 }}>
        <View style={styles.header}>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Attachment(s)</Text>
          {attachment?.data.length > 0 && (
            <MaterialCommunityIcons name="plus" size={20} onPress={() => reference.current?.show()} color="#3F434A" />
          )}
        </View>
        {!attachment?.data?.length && (
          <TouchableOpacity
            onPress={() => reference.current?.show()}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#304FFD" />
            <Text style={[{ color: "#304FFD", fontWeight: "500" }]}>Add Attachment</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: "100%" }}>
        <FlashList
          data={attachment?.data}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={30}
          refreshControl={<RefreshControl refreshing={attachmentIsFetching} onRefresh={() => refetchAttachment()} />}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.card}>
              <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <MaterialCommunityIcons
                  onPress={() =>
                    Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${item?.file_path}`, "_blank")
                  }
                  name="file-outline"
                  size={20}
                />
                <View style={{ gap: 3 }}>
                  <Text style={[{ fontSize: 14 }, TextProps]}>{item?.title}</Text>
                  <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                    {dayjs(item?.begin_date).format("DD MMM YYYY")} - {dayjs(item?.end_date).format("DD MMM YYYY")}
                  </Text>
                </View>
              </Pressable>

              <MaterialCommunityIcons name="trash-can-outline" size={20} onPress={() => setAttachmentId(item?.id)} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default AttendanceAttachment;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  addIcon: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#E8E9EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
