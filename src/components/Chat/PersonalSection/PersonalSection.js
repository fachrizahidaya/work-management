import React from "react";

import { StyleSheet, TouchableOpacity } from "react-native";
import { Flex, Icon, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const PersonalSection = ({ personalChats }) => {
  return (
    <>
      <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
        <Text opacity={0.5} fontWeight={500}>
          PEOPLE
        </Text>

        <TouchableOpacity style={styles.addButton}>
          <Icon as={<MaterialIcons name="add" />} color="black" />
        </TouchableOpacity>
      </Flex>

      {personalChats.length > 0 &&
        personalChats.map((personal) => {
          return <ContactListItem personal={personal} type="personal" key={personal.id} />;
        })}
    </>
  );
};

export default PersonalSection;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#f1f2f3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  },
});
