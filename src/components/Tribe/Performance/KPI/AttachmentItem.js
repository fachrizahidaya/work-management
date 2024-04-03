import { Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const AttachmentItem = ({ description, file_name, onDelete, employee_kpi_id, attachment_id, index }) => {
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
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          onPress={() => onDelete(employee_kpi_id, attachment_id, index)}
        />
      </View>
    </View>
  );
};

export default AttachmentItem;
