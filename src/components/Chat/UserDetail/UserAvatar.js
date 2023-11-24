import { Box, Flex, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserAvatar = ({ type, name, image, position, email }) => {
  return (
    <Flex pb={2} gap={2} bg="#FFFFFF" alignItems="center" justifyContent="center">
      <AvatarPlaceholder size="2xl" name={name} image={image} />
      <Text fontSize={16} fontWeight={500}>
        {name}
      </Text>
      {type === "personal " ? (
        <Box alignItems="center">
          <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
            {position}
          </Text>
          <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
            {email}
          </Text>
        </Box>
      ) : null}
    </Flex>
  );
};

export default UserAvatar;
