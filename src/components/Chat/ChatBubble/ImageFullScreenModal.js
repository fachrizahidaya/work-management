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
    <Modal position="relative" backgroundColor="#272A2B" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
      <Box gap={2} position="relative">
        <Flex pr={2} gap={2} flexDirection="row" justifyContent="flex-end" alignItems="flex-end">
          <TouchableOpacity onPress={() => attachmentDownloadHandler(file_path)}>
            <Icon as={<MaterialCommunityIcons name="download" />} size={6} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFullScreen(false)}>
            <Icon as={<MaterialCommunityIcons name="close" />} size={6} />
          </TouchableOpacity>
        </Flex>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
          height={400}
          width={400}
          alt="Feed Image"
          resizeMode="contain"
        />
      </Box>
    </Modal>
  );
};

export default ImageFullScreenModal;
