import React from "react";
import { Box, Flex, Image, Pressable, Slide, Text } from "native-base";
import { useSelector } from "react-redux";

/**
 * @function ModuleSelectSlider
 * @param {boolean} isOpen - Whether the module selection slider is open or closed.
 * @param {function} setSelectedModule - Function to handle the selected module.
 */
const ModuleSelectSlider = ({ isOpen, setIsOpen, setSelectedModule }) => {
  // Get user data from the Redux store
  const userSelector = useSelector((state) => state.auth);

  return (
    <Slide in={isOpen} placement="bottom" duration={200}>
      <Pressable position="absolute" zIndex={2} width="100%" h="70%" onPress={() => setIsOpen(!isOpen)}></Pressable>
      <Box
        position="absolute"
        bottom={95} // Adjust this value to position the slide component
        width="100%"
        bgColor="white"
        zIndex={3}
      >
        {userSelector?.user_module &&
          userSelector.user_module.map((item, idx) => {
            return (
              <Pressable key={idx} onPress={() => setSelectedModule(item.module_name)}>
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
    </Slide>
  );
};

export default ModuleSelectSlider;
