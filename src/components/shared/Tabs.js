import React, { memo } from "react";

import { Pressable, Text, View } from "react-native";
import { TextProps } from "./CustomStylings";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * @param {Array} tabs - An array of tab objects.
 * @param {string} value - The currently selected tab value.
 * @param {function} onChange - Function to handle tab selection changes.
 */
const Tabs = ({ tabs = [], value, onChange, justify, withIcon = false }) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderColor: "#E8E9EB" }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: justify ? justify : "flex-start",
            flex: 1,
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
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={[{ textTransform: "capitalize" }, TextProps]}>{tab.title}</Text>
                    {withIcon && <MaterialCommunityIcons name="circle" color={tab.color} size={10} />}
                  </View>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(Tabs);
