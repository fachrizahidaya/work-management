import React from "react";
import { Text, View } from "react-native";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const SelectedUserList = ({ name, image, id }) => {
  return (
    <View
      key={id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#F5F5F5",
        borderRadius: 15,
        gap: 5,
      }}
    >
      <AvatarPlaceholder name={name} image={image} isThumb={false} size="xs" />
      <Text style={[{ fontSize: 12 }, TextProps]}>{name.length > 8 ? name.slice(0, 8) + "..." : name}</Text>
    </View>
  );
};

export default SelectedUserList;
