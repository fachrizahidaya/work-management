import { Box, Flex, Icon, Image, Modal } from "native-base";
import { Linking, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path }) => {
  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backgroundColor="#272A2B" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
      <Box position="relative">
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
          height={300}
          width={400}
          alt="Feed Image"
          resizeMode="contain"
        />
        <Flex
          position="absolute"
          right={0}
          top={0}
          pr={2}
          gap={2}
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <TouchableOpacity onPress={() => attachmentDownloadHandler(file_path)}>
            <Icon as={<MaterialCommunityIcons name="download" />} size={6} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFullScreen(false)}>
            <Icon as={<MaterialCommunityIcons name="close" />} size={6} color="#FFFFFF" />
          </TouchableOpacity>
        </Flex>
      </Box>
    </Modal>
  );
};

export default ImageFullScreenModal;
