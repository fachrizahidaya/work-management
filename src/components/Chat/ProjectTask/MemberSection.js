import { Flex, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const MemberSection = ({ name, image }) => {
  return (
    <Flex py={1} gap={2} flexDirection="row">
      <AvatarPlaceholder name={name} image={image} />
      <Text fontSize={12} fontWeight={400}>
        {name?.split(" ")[0]}
      </Text>
    </Flex>
  );
};

export default MemberSection;
