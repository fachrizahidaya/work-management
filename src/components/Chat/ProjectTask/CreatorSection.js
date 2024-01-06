import { View, Pressable, Text } from "react-native";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const CreatorSection = ({ name, image }) => {
  return (
    <Pressable
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 5,
        gap: 5,
        borderRadius: 10,
      }}
    >
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={[{ fontSize: 12 }, TextProps]}>Created by</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <AvatarPlaceholder name={name} image={image} />
        <Text style={[{ fontSize: 12 }, TextProps]}>{name}</Text>
      </View>
    </Pressable>
  );
};

export default CreatorSection;
