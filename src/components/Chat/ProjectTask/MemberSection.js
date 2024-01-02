import { View, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const MemberSection = ({ name, image }) => {
  return (
    <View style={{ flexDirection: "row", padding: 5 }} flexDirection="row">
      <AvatarPlaceholder name={name} image={image} />
      <Text style={{ fontSize: 12, fontWeight: "400" }}>{name?.split(" ")[0]}</Text>
    </View>
  );
};

export default MemberSection;
