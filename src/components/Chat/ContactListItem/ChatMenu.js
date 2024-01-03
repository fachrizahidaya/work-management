import { useNavigation } from "@react-navigation/native";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";

const ChatMenu = ({ onClose, reference }) => {
  const navigation = useNavigation();
  const menuOptions = [
    {
      name: "New Chat",
      onPress: () => {
        onClose();
        navigation.navigate("New Chat");
      },
    },
    // {
    //   name: "New Group",
    //   onPress: () => {
    //     onClose();
    //     navigation.navigate("Group Participant");
    //   },
    // },
    // {
    //   name: "Select Message",
    // },
  ];

  return (
    <ActionSheet ref={reference} onClose={reference.current?.hide()}>
      <View style={{ ...styles.wrapper, gap: 5 }}>
        {menuOptions.map((option, index) => {
          return (
            <TouchableOpacity key={index} onPress={option.onPress} style={styles.container}>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={{ ...styles.wrapper, alignItems: "center", justifyContent: "center" }}
        onPress={() => reference.current?.hide()}
      >
        <Text style={{ fontSize: 16, fontWeight: "400", color: "#176688" }}>Cancel</Text>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default ChatMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
