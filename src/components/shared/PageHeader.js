import React, { memo } from "react";

import { Dimensions, View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PageHeader = ({ width, title, subTitle, backButton = true, withLoading, isLoading, onPress }) => {
  const { width: screenWidth } = Dimensions.get("screen");
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        maxWidth: width ? width : screenWidth - 45,
      }}
    >
      {backButton && (
        <Pressable onPress={onPress}>
          <MaterialCommunityIcons name="keyboard-backspace" size={20} />
        </Pressable>
      )}

      {withLoading ? (
        !isLoading ? (
          <Text style={{ fontSize: 16, fontWeight: 500 }} numberOfLines={2}>
            {title}
            {subTitle && <Text style={{ color: "#176688", fontWeight: 500 }}> #{subTitle}</Text>}
          </Text>
        ) : (
          <Text>Loading...</Text>
        )
      ) : (
        <Text style={{ fontSize: 16, fontWeight: 500 }} numberOfLines={2}>
          {title}
          {subTitle && <Text style={{ color: "#176688", fontWeight: 500 }}> #{subTitle}</Text>}
        </Text>
      )}
    </View>
  );
};

export default memo(PageHeader);
