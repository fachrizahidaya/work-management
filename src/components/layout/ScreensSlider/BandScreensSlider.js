import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Actionsheet, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandScreensSlider = ({ isOpen, toggle }) => {
  const navigation = useNavigation();

  const items = [
    {
      icons: "sticker-check-outline",
      title: "Dashboard",
      screen: "Dashboard",
    },
    {
      icons: "lightning-bolt-outline",
      title: "Project List",
      screen: "Project List",
    },
    {
      icons: "format-list-bulleted",
      title: "Task list",
      screen: "Task List",
    },
    {
      icons: "account-group-outline",
      title: "My Team",
      screen: "My Team",
    },
    {
      icons: "calendar-clock",
      title: "Calendar",
      screen: "Calendar",
    },
    {
      icons: "note-outline",
      title: "Notes",
      screen: "Notes",
    },
    // {
    //   icons: "folder-outline",
    //   title: "KSS Drive",
    //   screen: "",
    // },
  ];
  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {items.map((item, idx) => {
          return (
            <Actionsheet.Item
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              onPress={() => {
                navigation.navigate(item.screen);
                toggle();
              }}
            >
              <Flex flexDir="row" alignItems="center" width="100%" gap={21}>
                <Box
                  bg="#f7f7f7"
                  borderRadius={5}
                  style={{ height: 32, width: 32 }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                </Box>
                <Text key={item.title} fontWeight={700} color="black">
                  {item.title}
                </Text>
              </Flex>
            </Actionsheet.Item>
          );
        })}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default BandScreensSlider;
