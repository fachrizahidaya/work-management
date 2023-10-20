import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Actionsheet, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useGetSubMenu } from "../../../hooks/useGetSubMenu";

const BandScreensSlider = ({ isOpen, toggle }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);
  const { mergedMenu } = useGetSubMenu(menuSelector.user_menu);

  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {mergedMenu.map((item, idx) => {
          return (
            <Actionsheet.Item
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              onPress={() => {
                navigation.navigate(item.name);
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
                  <Icon as={<MaterialCommunityIcons name={item.icon} />} size={6} color="#2A7290" />
                </Box>
                <Text fontWeight={700} color="black">
                  {item.name}
                </Text>
              </Flex>
            </Actionsheet.Item>
          );
        })}
        <Actionsheet.Item
          borderColor="#E8E9EB"
          borderBottomWidth={1}
          onPress={() => {
            navigation.navigate("Calendar");
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
              <Icon as={<MaterialCommunityIcons name="calendar-clock" />} size={6} color="#2A7290" />
            </Box>
            <Text fontWeight={700} color="black">
              Calendar
            </Text>
          </Flex>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default BandScreensSlider;
