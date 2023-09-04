import React from "react";

import { Dimensions, StyleSheet } from "react-native";
import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * @param {ReactNode} children - The options to be displayed in the dropdown.
 * @param {string} value - The selected value to display in the select box.
 * @param {boolean} open - Whether the dropdown is open or closed.
 * @param {function} setOpen - Function to toggle the dropdown's open state.
 * @param {ReactNode} startAdornment - Element to be displayed before the value in the select box.
 * @param {string} bgColor - Background color of the select box.
 */
const CustomSelect = ({ children, value, open, setOpen, startAdornment, bgColor }) => {
  // Get the height of the window
  const { height } = Dimensions.get("window");

  return (
    <Flex gap={2}>
      <Pressable onPress={() => setOpen(!open)}>
        <Flex
          borderWidth={1}
          borderColor="#cbcbcb"
          borderRadius={15}
          py={1}
          px={3}
          bgColor={bgColor || "#F8F8F8"}
          style={{ height: 40 }}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flexDir="row" alignItems="center" style={{ gap: 10 }}>
            {startAdornment}
            <Text>{value}</Text>
          </Flex>

          <Icon as={<MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} />} size="md" />
        </Flex>
      </Pressable>

      {/* Dropdown content */}
      {open && (
        <>
          {/* Transparent overlay to close the dropdown */}
          <Box position="absolute" height={height} width="100%" zIndex={1} onTouchStart={() => setOpen(false)}></Box>

          {/* Dropdown options */}
          <Flex zIndex={2} style={styles.menu}>
            {children}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});
