import { useNavigation } from "@react-navigation/native";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";

const ChatMenu = ({ reference }) => {
  const navigation = useNavigation();
  const menuOptions = [
    {
      id: 1,
      name: "New Chat",
      onPress: () => {
        reference.current?.hide();
        navigation.navigate("New Chat");
      },
    },
  ];

  return (
    <ActionSheet ref={reference} onClose={reference.current?.hide()}>
      {menuOptions.map((option, index) => {
        return (
          <TouchableOpacity key={index} onPress={option.onPress} style={styles.container}>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
          </TouchableOpacity>
        );
      })}

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
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
