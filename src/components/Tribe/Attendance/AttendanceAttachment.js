import dayjs from "dayjs";

import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const AttendanceAttachment = ({ attachment, setAttachmentId, reference, attachmentIsFetching, refetchAttachment }) => {
  return (
    <View style={{ flex: 1, gap: 5, marginVertical: 15, paddingHorizontal: 15 }}>
      <View style={styles.header}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Attachment(s)</Text>
        {attachment?.data.length > 0 && (
          <MaterialCommunityIcons name="plus" size={20} onPress={() => reference.current?.show()} color="#3F434A" />
        )}
      </View>

      <View style={{ height: 250, gap: 5 }}>
        {attachment?.data.length > 0 ? (
          <FlashList
            data={attachment?.data}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            estimatedItemSize={30}
            refreshControl={<RefreshControl refreshing={attachmentIsFetching} onRefresh={() => refetchAttachment()} />}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <MaterialCommunityIcons name="file-outline" size={20} />
                  <View style={{ gap: 3 }}>
                    <Text style={[{ fontSize: 14 }, TextProps]}>{item?.title}</Text>
                    <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                      {dayjs(item?.begin_date).format("DD MMM YYYY")} - {dayjs(item?.end_date).format("DD MMM YYYY")}
                    </Text>
                  </View>
                </View>

                <MaterialCommunityIcons name="trash-can-outline" size={20} onPress={() => setAttachmentId(item?.id)} />
              </View>
            )}
          />
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center", gap: 5, padding: 50 }}>
            <Pressable style={styles.addIcon} onPress={() => reference.current?.show()}>
              <MaterialCommunityIcons name="plus" size={60} />
            </Pressable>
            <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
          </View>
        )}
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
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addIcon: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#E8E9EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
