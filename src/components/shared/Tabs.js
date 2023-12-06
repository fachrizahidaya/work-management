import React, { memo } from "react";

import { Box, Flex, Pressable, Text } from "native-base";

/**
 * @param {Array} tabs - An array of tab objects.
 * @param {string} value - The currently selected tab value.
 * @param {function} onChange - Function to handle tab selection changes.
 */
const Tabs = ({ tabs = [], value, onChange, justifyContent, isValue, flexDir, gap }) => {
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
              <Flex
                flexDirection={flexDir ? flexDir : null}
                alignItems="center"
                borderBottomWidth={value === tab.title ? 2 : 0}
                borderColor="#377893"
                px={2}
                pb={3}
                gap={gap ? gap : null}
              >
                <Text textTransform="uppercase">{tab.title}</Text>
                {isValue ? <Text>{tab.number}</Text> : null}
              </Flex>
            </Pressable>
          );
        })}
    </Flex>
  );
};

export default memo(Tabs);
