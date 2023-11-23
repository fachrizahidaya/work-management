import { Image, Modal } from "native-base";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path }) => {
  console.log("modal", file_path);
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
