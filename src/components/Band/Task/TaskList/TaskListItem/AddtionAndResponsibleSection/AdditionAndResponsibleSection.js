import React from "react";

import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../../shared/AvatarPlaceholder";

const AdditionAndResponsibleSection = ({
  image,
  totalAttachments,
  totalChecklists,
  totalChecklistsDone,
  totalComments,
  responsible,
}) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ display: "flex", gap: 5 }}>
        {totalAttachments > 0 && (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
            <MaterialCommunityIcons name="attachment" />
            <Text style={{ fontWeight: 400, fontSize: 16 }}>{totalAttachments || 0}</Text>
          </View>
        )}

        {totalComments > 0 && (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
            <MaterialCommunityIcons name="message-text-outline" />
            <Text style={{ fontWeight: 400, fontSize: 16 }}>{totalComments || 0}</Text>
          </View>
        )}

        {totalChecklists > 0 && (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
            <MaterialCommunityIcons name="checkbox-marked-outline" />
            <Text style={{ fontWeight: 400, fontSize: 16 }}>
              {totalChecklistsDone || 0} / {totalChecklists || 0}
            </Text>
          </View>
        )}
      </View>

      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
        {responsible && <AvatarPlaceholder image={image} name={responsible} />}
      </View>
    </View>
  );
};

export default AdditionAndResponsibleSection;
