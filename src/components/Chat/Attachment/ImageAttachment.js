import { Box, Image } from "native-base";

const ImageAttachment = ({ image, setImage }) => {
  return (
    <Box alignSelf="center">
      <Image source={{ uri: image.uri }} style={{ width: 300, height: 300, borderRadius: 15 }} alt="image selected" />
    </Box>
  );
};

export default ImageAttachment;
