import { Flex } from "native-base";
import { View, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ObserverSection = ({ name, image }) => {
  return (
    <View style={{ flexDirection: "row", gap: 5, padding: 5 }}>
      <AvatarPlaceholder name={name} image={image} />
      <Text style={{ fontSize: 12, fontWeight: "400" }}>{name}</Text>
    </View>
  );
};

export default ObserverSection;
