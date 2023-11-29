import React from "react";
import { useNavigation } from "@react-navigation/native";

import { StyleSheet, TouchableOpacity } from "react-native";
import { Flex, Icon, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const PersonalSection = ({ personalChats, searchKeyword, searchResult, toggleDeleteModal }) => {
  const navigation = useNavigation();
  return !searchKeyword ? (
    <>
      <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
        <Text opacity={0.5} fontWeight={500}>
          PEOPLE
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("New Chat")}>
          <Icon as={<MaterialIcons name="add" />} color="black" />
        </TouchableOpacity>
      </Flex>

      {personalChats.length > 0 &&
        personalChats.map((personal) => {
          return (
            <ContactListItem
              chat={personal}
              type="personal"
              key={personal.id}
              id={personal.id}
              userId={personal?.user?.id}
              name={personal.user?.name}
              image={personal.user?.image}
              position={personal.user?.user_type}
              email={personal.user?.email}
              message={personal.latest_message?.message}
              fileName={personal.latest_message?.file_name}
              project={personal.latest_message?.project_id}
              task={personal.latest_message?.task_id}
              isDeleted={personal.latest_message?.delete_for_everyone}
              time={personal.latest_message?.created_time}
              timestamp={personal.latest_message?.created_at}
              isRead={personal.unread}
              isPinned={personal?.pin_personal}
              active_member={0}
              toggleDeleteModal={toggleDeleteModal}
            />
          );
        })}
    </>
  ) : (
    <>
      {searchResult?.length > 0 && (
        <>
          <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
            <Text opacity={0.5} fontWeight={500}>
              PEOPLE
            </Text>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("New Chat")}>
              <Icon as={<MaterialIcons name="add" />} color="black" />
            </TouchableOpacity>
          </Flex>

          {searchResult.map((personal) => (
            <ContactListItem
              type="personal"
              key={personal.id}
              id={personal.id}
              userId={personal.user?.id}
              name={personal.user?.name}
              image={personal.user?.image}
              message={personal.latest_message?.message}
              fileName={personal.latest_message?.file_name}
              project={personal.latest_message?.project_id}
              task={personal.latest_message?.task_id}
              isDeleted={personal.latest_message?.delete_for_everyone}
              time={personal.latest_message?.created_time}
              isRead={personal.unread}
              timestamp={personal.latest_message?.created_at}
              searchKeyword={searchKeyword}
            />
          ))}
        </>
      )}
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
