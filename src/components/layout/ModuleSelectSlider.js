import React from "react";

import { useSelector } from "react-redux";

import { Actionsheet, Flex, Image, Text } from "native-base";

/**
 * @function ModuleSelectSlider
 * @param {boolean} isOpen - Whether the module selection slider is open or closed.
 * @param {function} setSelectedModule - Function to handle the selected module.
 */
const ModuleSelectSlider = ({ isOpen, toggle, setSelectedModule }) => {
  // Get user data from the Redux store
  const userSelector = useSelector((state) => state.auth);

  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {userSelector?.user_module &&
          userSelector.user_module.map((item, idx) => {
            return (
              <Actionsheet.Item
                key={idx}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                onPress={() => {
                  setSelectedModule(item.module_name);
                }}
              >
                <Flex flexDir="row" alignItems="center">
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
              </Actionsheet.Item>
            );
          })}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ModuleSelectSlider;
