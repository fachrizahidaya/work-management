import { Box, Flex, Image, Pressable, Text } from "native-base";

const AttachmentSection = () => {
  return (
    <Pressable
      display="flex"
      flexDir="row"
      alignItems="center"
      bgColor="#ffffff"
      py={3}
      px={3}
      borderRadius={10}
      justifyContent="space-between"
      gap={3}
      flex={1}
    >
      <Flex justifyContent="center" alignItems="center">
        <Image
          alt="attachment"
          h={150}
          w={180}
          resizeMode="cover"
          source={require("../../../assets/vectors/empty.png")}
        />
        <Box>
          <Text>No Data</Text>
        </Box>
      </Flex>
    </Pressable>
  );
};

export default AttachmentSection;
