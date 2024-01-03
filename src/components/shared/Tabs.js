import React, { memo } from "react";

import { Pressable, Text, View } from "react-native";

/**
 * @param {Array} tabs - An array of tab objects.
 * @param {string} value - The currently selected tab value.
 * @param {function} onChange - Function to handle tab selection changes.
 */
const Tabs = ({ tabs = [], value, onChange, justify }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        borderBottomWidth: 1,
        borderColor: "#E8E9EB",
        justifyContent: justify ? justify : "flex-start",
      }}
    >
      {tabs.length > 0 &&
        tabs.map((tab, idx) => {
          return (
            <Pressable key={idx} onPress={() => onChange(tab.value)}>
              <View
                style={{
                  borderBottomWidth: value === tab.value ? 2 : 0,
                  borderColor: "#377893",
                  paddingHorizontal: 4,
                  paddingBottom: 12,
                }}
              >
                <Text style={{ textTransform: "uppercase", fontWeight: 500 }}>{tab.title}</Text>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

export default memo(Tabs);
