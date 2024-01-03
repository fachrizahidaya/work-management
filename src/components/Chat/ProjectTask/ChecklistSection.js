import { View, Text } from "react-native";

import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChecklistSection = ({ title, status, id }) => {
  return (
    <View style={{ paddingVertical: 5, gap: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MateriaCommunitylIcons name="checkbox-marked-circle-outline" />
        <Text
          style={{
            textDecorationLine: status === "Finish" ? "line-through" : null,
            textDecorationStyle: status === "Finish" ? "solid" : null,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default ChecklistSection;
