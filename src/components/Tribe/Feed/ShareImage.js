import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const ShareImage = ({ reference, type, sharePost }) => {
  return (
    <ActionSheet ref={reference} onClose={() => reference.current?.hide()} size="full">
      <View
        style={{
          gap: 21,
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            gap: 1,
            backgroundColor: "#F5F5F5",
            borderRadius: 10,
          }}
        >
          {type === "Post" && (
            <TouchableOpacity
              onPress={() => {
                sharePost("URL Example", `https://kolabora.ksshub.com/tribe`);
                reference.current?.hide();
              }}
              style={{
                ...styles.containerApproval,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text style={[{ fontSize: 16, fontWeight: "400" }, TextProps]}>Share via Whatsapp</Text>
              <MaterialCommunityIcons name="whatsapp" color="#EB0E29" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ActionSheet>
  );
};

export default ShareImage;

const styles = StyleSheet.create({
  containerApproval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
