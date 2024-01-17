import { Text, View, ActivityIndicator } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const ClearChatAction = ({ name, isLoading, reference }) => {
  return (
    <ActionSheet ref={reference} onClose={() => reference.current?.hide()}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, width: 350 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Clear all message from "{name}"?</Text>
        </View>
        <MaterialCommunityIcons onPress={() => reference.current?.hide()} name="close" />
      </View>

      <View style={{ flexDirection: "row", width: 350 }}>
        <Text style={[{ fontSize: 16 }, TextProps]}>This chat will be empty but will remain in your chat list.</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: 350 }}>
        <Text style={{ fontSize: 16, fontWeight: "400", color: "#FF0303", textAlign: isLoading ? "center" : null }}>
          {isLoading ? <ActivityIndicator /> : "Clear All Messages"}
        </Text>
        <MaterialCommunityIcons onPress={() => reference.current?.hide()} name="trash-can" size={10} color="#FF0303" />
      </View>
    </ActionSheet>
  );
};

export default ClearChatAction;
