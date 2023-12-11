import React, { memo } from "react";

import { Box, Flex, Pressable, Text } from "native-base";

/**
 * @param {Array} tabs - An array of tab objects.
 * @param {string} value - The currently selected tab value.
 * @param {function} onChange - Function to handle tab selection changes.
 */
const Tabs = ({ tabs = [], value, onChange, justify }) => {
  return (
    <Flex flexDir="row" gap={10} borderBottomWidth={1} borderColor="#E8E9EB" justifyContent={justify ? justify : null}>
      {tabs.length > 0 &&
        tabs.map((tab, idx) => {
          return (
            <Pressable key={idx} onPress={() => onChange(tab.title)}>
              <Box borderBottomWidth={value === tab.title ? 2 : 0} borderColor="#377893" px={2} pb={3}>
                <Text textTransform="uppercase">{tab.title}</Text>
              </Box>
            </Pressable>
          );
        })}
    </Flex>
  );
};

export default memo(Tabs);
