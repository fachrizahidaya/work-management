import React from "react";

import { useSelector } from "react-redux";

import { Dimensions } from "react-native";
import { Box, Flex, Image, Pressable, Text } from "native-base";

/**
 * @function ModuleSelectSlider
 * @param {boolean} isOpen - Whether the module selection slider is open or closed.
 * @param {function} setSelectedModule - Function to handle the selected module.
 */
const ModuleSelectSlider = ({ toggle, setSelectedModule }) => {
  // Get user data from the Redux store
  const userSelector = useSelector((state) => state.auth);
  const { height } = Dimensions.get("window");

  return (
    <Box>
      {/* Invisible layout to close the menu below */}
      <Pressable position="absolute" bottom={79} height={height} width="100%" zIndex={2} onPress={toggle}></Pressable>

      {/* Menu selection */}
      <Box position="absolute" bottom={79} width="100%" bgColor="white" zIndex={3}>
        {userSelector?.user_module &&
          userSelector.user_module.map((item, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  setSelectedModule(item.module_name);
                }}
              >
                <Flex
                  flexDir="row"
                  alignItems="center"
                  px={8}
                  py={4}
                  borderColor="#E8E9EB"
                  borderBottomWidth={1}
                  borderTopWidth={item.module_name === "SETTING" ? 1 : 0}
                >
                  <Image
                    size={8}
                    borderRadius={100}
                    source={{
                      uri: `${item.module_image}ICON.png`,
                    }}
                    alt={item.module_name}
                  />
                  <Flex direction="row" marginLeft={4}>
                    <Text fontWeight={700}>
                      {item.module_name.charAt(0).toUpperCase() + item.module_name.slice(1).toLowerCase()}
                    </Text>
                    <Text> | {item.module_label}</Text>
                  </Flex>
                </Flex>
              </Pressable>
            );
          })}
      </Box>
    </Box>
  );
};

export default ModuleSelectSlider;
