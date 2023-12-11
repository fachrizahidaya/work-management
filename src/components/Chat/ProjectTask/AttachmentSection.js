import { Box, Flex, Image, Pressable, Text } from "native-base";

const AttachmentSection = () => {
  return (
    <Pressable display="flex" alignItems="center" bgColor="#ffffff" py={3} px={3} borderRadius={10} gap={3}>
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
