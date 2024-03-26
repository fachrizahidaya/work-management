import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AttendanceAttachmentList from "./AttendanceAttachmentList";

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

      <AttendanceAttachmentList
        data={attachment?.data}
        isFetching={attachmentIsFetching}
        refetch={refetchAttachment}
        setAttachmentId={setAttachmentId}
      />
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
