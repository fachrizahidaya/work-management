import { View, Text } from "react-native";

import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const ChecklistItem = ({ title, status }) => {
  return (
    <View style={{ paddingVertical: 5, gap: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MateriaCommunitylIcons name="checkbox-marked-circle-outline" />
        <Text
          style={[
            {
              fontSize: 12,
              textDecorationLine: status === "Finish" ? "line-through" : null,
              textDecorationStyle: status === "Finish" ? "solid" : null,
            },
            TextProps,
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default ChecklistItem;
