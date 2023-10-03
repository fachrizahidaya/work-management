import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions } from "react-native";
import { Box, FlatList, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandScreensSlider = ({ toggle }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");

  const items = [
    {
      icons: "sticker-check-outline",
      title: "Dashboard",
      screen: "Dashboard",
    },
    {
      icons: "layers-triple-outline",
      title: "Project List",
      screen: "Project List",
    },
    {
      icons: "format-list-bulleted",
      title: "Task list",
      screen: "Task List",
    },
    {
      icons: "lightning-bolt",
      title: "My Team",
      screen: "My Team",
    },
    {
      icons: "calendar-clock",
      title: "Calendar",
      screen: "",
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
    <Box>
      <Pressable position="absolute" bottom={79} height={height} width="100%" zIndex={2} onPress={toggle}></Pressable>
      <Box position="absolute" zIndex={3} bottom={79} width="100%" bgColor="white">
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate(item.screen);
                toggle();
              }}
            >
              <Flex
                flexDir="row"
                alignItems="center"
                gap={25}
                px={8}
                py={4}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                borderTopWidth={item.icons === "home" ? 1 : 0}
              >
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
            </Pressable>
          )}
        />
      </Box>
    </Box>
  );
};

export default BandScreensSlider;
