import { Box, Flex, Icon, Image, Pressable } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageAttachment = ({ image, setImage }) => {
  return (
    <Flex px={5} py={5} gap={5} bgColor="white" position="absolute" top="80px" bottom="60px" left={0} right={0}>
      <Flex flexDir="row-reverse">
        <Pressable onPress={() => setImage(null)}>
          <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
        </Pressable>
      </Flex>
      <Box alignSelf="center">
        <Image source={{ uri: image.uri }} style={{ width: 300, height: 300, borderRadius: 15 }} alt="image selected" />
      </Box>
    </Flex>
  );
};

export default ImageAttachment;
