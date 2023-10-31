import React from "react";
import { useNavigation } from "@react-navigation/native";

import { StyleSheet, TouchableOpacity } from "react-native";
import { Flex, Icon, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const GroupSection = ({ groupChats }) => {
  const navigation = useNavigation();
  console.log(groupChats);
  return (
    <>
      <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
        <Text opacity={0.5} fontWeight={500}>
          TEAMS
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("User Selection")}>
          <Icon as={<MaterialIcons name="add" />} color="black" />
        </TouchableOpacity>
      </Flex>

      {groupChats.length > 0 &&
        groupChats.map((group) => {
          return <ContactListItem group={group} type="group" key={group.id} />;
        })}
    </>
  );
};

export default GroupSection;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#f1f2f3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  },
});
