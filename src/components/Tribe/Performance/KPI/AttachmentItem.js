import React from "react";
import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const AttachmentItem = ({
  description,
  file_name,
  file_path,
  onDelete,
  reviewMode,
  employee_kpi_id,
  attachment_id,
  index,
  confirmed,
  onDownload,
}) => {
  return (
    <View
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Text style={[TextProps]}>{description}</Text>
        <View style={{ backgroundColor: "#f8f8f8", padding: 5, borderRadius: 10, flexWrap: "wrap" }}>
          <Text style={[TextProps, { fontSize: 10, color: "#176688" }]}>{file_name}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        {confirmed ? (
          <MaterialCommunityIcons
            name="tray-arrow-down"
            size={20}
            color="#3F434A"
            onPress={() => onDownload(file_path)}
          />
        ) : (
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            onPress={() => onDelete(employee_kpi_id, attachment_id, index)}
          />
        )}
      </View>
    </View>
  );
};

export default AttachmentItem;
