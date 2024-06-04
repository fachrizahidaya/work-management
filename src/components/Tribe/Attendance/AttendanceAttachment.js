import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AttendanceAttachmentList from "./AttendanceAttachmentList";
import { memo } from "react";

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

export default memo(AttendanceAttachment);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
});
