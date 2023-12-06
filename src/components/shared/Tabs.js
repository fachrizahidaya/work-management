import React, { memo } from "react";

import { Box, Flex, Pressable, Text } from "native-base";

/**
 * @param {Array} tabs - An array of tab objects.
 * @param {string} value - The currently selected tab value.
 * @param {function} onChange - Function to handle tab selection changes.
 */
const Tabs = ({ tabs = [], value, onChange, justifyContent }) => {
  return (
    <Flex
      flexDir="row"
      justifyContent={justifyContent ? justifyContent : null}
      gap={10}
      borderBottomWidth={1}
      borderColor="#E8E9EB"
    >
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
