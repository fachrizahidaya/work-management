import { Image, Modal } from "native-base";
import { Linking } from "react-native";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path }) => {
  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backgroundColor="#000000" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
      <Modal.Content backgroundColor="#000000">
        <Modal.CloseButton />
        <Modal.Body alignContent="center">
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
            height={500}
            width={500}
            alt="Feed Image"
            resizeMode="contain"
          />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ImageFullScreenModal;
