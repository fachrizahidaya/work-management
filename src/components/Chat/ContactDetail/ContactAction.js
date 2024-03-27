import { View, Text, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const ContactAction = ({ type, active_member, toggleClearChatMessage, toggleExitModal, toggleDeleteGroupModal }) => {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 10,
        gap: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: 10,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          gap: 5,
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            paddingHorizontal: 5,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#ffffff",
          }}
          onPress={toggleClearChatMessage}
        >
          <Text style={[{ fontSize: 14, fontWeight: "400", color: "#EB0E29" }]}>Clear Messages</Text>
          <MaterialCommunityIcons name={"close-circle-outline"} size={15} color="#EB0E29" />
        </TouchableOpacity>

        {type === "group" && active_member === 1 && (
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 5,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#fafafa",
              justifyContent: "space-between",
            }}
            onPress={toggleExitModal}
          >
            <Text style={[{ fontSize: 14 }, TextProps]}>Exit Group</Text>
            <MaterialCommunityIcons
              name={type === "personal" ? "not-interested" : "exit-to-app"}
              size={15}
              color="#3F434A"
            />
          </TouchableOpacity>
        )}
        {type === "group" && active_member === 0 && (
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
              paddingVertical: 8,
              gap: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#fafafa",
              justifyContent: "space-between",
            }}
            onPress={toggleDeleteGroupModal}
          >
            <Text style={[{ fontSize: 14, fontWeight: "400", color: "#EB0E29" }]}>Delete Group</Text>
            <MaterialCommunityIcons
              name={type === "personal" ? "not-interested" : "trash-can-outline"}
              size={15}
              color="#EB0E29"
            />
          </TouchableOpacity>
        )}
        {/* <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Block {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable> */}
        {/* <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Report {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable> */}
      </View>
    </View>
  );
};

export default ContactAction;
