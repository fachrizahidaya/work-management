import { Box, Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const Description = ({ navigation, description }) => {
  return (
    <Box gap={2}>
      <Pressable
        display="flex"
        flexDirection="row"
        alignItems="center"
        bgColor="#ffffff"
        p={3}
        borderRadius={10}
        justifyContent="space-between"
      >
        <Text fontSize={14} fontWeight={400}>
          {description}
        </Text>
      </Pressable>
    </Box>
  );
};

export default Description;
