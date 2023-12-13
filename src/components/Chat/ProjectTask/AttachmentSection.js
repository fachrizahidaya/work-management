import { Box, Flex, Image, Text } from "native-base";

const AttachmentSection = () => {
  return (
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
  );
};

export default AttachmentSection;
