import { Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const MemberSection = ({ name, image }) => {
  return (
    <Pressable
      flex={1}
      gap={2}
      display="flex"
      bgColor="#ffffff"
      py={2}
      borderRadius={10}
      justifyContent="space-between"
    >
      <Flex gap={2} flexDirection="row">
        <AvatarPlaceholder name={name} image={image} />
        <Text fontSize={12} fontWeight={400}>
          {name?.split(" ")[0]}
        </Text>
      </Flex>
    </Pressable>
  );
};

export default MemberSection;
