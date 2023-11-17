import React, { memo } from "react";

import dayjs from "dayjs";

import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Flex, HStack, Icon, IconButton, Menu, Text, View } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../../hooks/useCheckAccess";

const NoteItem = ({ note, id, title, date, isPinned, onPress, openDeleteModal, openEditForm }) => {
  const deleteCheckAccess = useCheckAccess("delete", "Notes");

  return (
    <TouchableOpacity onPress={() => openEditForm(note)}>
      <Flex style={styles.card} gap={18}>
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          borderStyle={Platform.OS === "android" && "dashed"}
          borderBottomWidth={Platform.OS === "android" && 2.5}
          paddingBottom={Platform.OS === "android" && 18}
          borderColor={Platform.OS === "android" && "#E8E9EB"}
        >
          <HStack space={2}>
            <Icon as={<MaterialCommunityIcons name="calendar-month" />} size="md" />

            <Text>{dayjs(date).format("DD MMMM, YYYY")}</Text>
          </HStack>

          <HStack space={2}>
            <IconButton
              icon={
                <Icon
                  as={<MaterialCommunityIcons name={!isPinned ? "pin-outline" : "pin"} />}
                  style={{ transform: [{ rotate: "45deg" }] }}
                  color="#3F434A"
                />
              }
              borderRadius="full"
              onPress={() => onPress(id, !isPinned ? "pinned" : "unpinned")}
            />

            <Menu
              trigger={(triggerProps) => {
                return (
                  <IconButton
                    {...triggerProps}
                    icon={<Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="#3F434A" />}
                    borderRadius="full"
                  />
                );
              }}
            >
              {deleteCheckAccess && (
                <Menu.Item onPress={() => openDeleteModal(note)}>
                  <Flex flexDir="row" alignItems="center" gap={2}>
                    <Icon as={<MaterialCommunityIcons name="delete-outline" />} color="red.500" />
                    <Text color="red.500">Delete</Text>
                  </Flex>
                </Menu.Item>
              )}
            </Menu>
          </HStack>
        </Flex>

        {Platform.OS === "ios" && (
          <View style={{ overflow: "hidden" }}>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "#E8E9EB",
                margin: -2,
                marginTop: 0,
                height: 5,
              }}
            />
          </View>
        )}

        <Text>{title}</Text>
      </Flex>
    </TouchableOpacity>
  );
};

export default memo(NoteItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    // height: 270,
  },
});
