import { View, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const MemberSection = ({ name, image }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginVertical: 5 }}>
      <AvatarPlaceholder name={name} image={image} size="xs" />
      <Text style={[{ fontSize: 12 }, TextProps]}>{name?.split(" ")[0]}</Text>
    </View>
  );
};

export default MemberSection;
