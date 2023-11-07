import { Box, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const FileAttachment = ({ file, setFile }) => {
  /**
   * Convert byte into proper unit
   *
   * @param {*} bytes
   * @param {*} decimals
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <Box alignItems="center">
      <Icon as={<MaterialCommunityIcons name="file-pdf-box" />} size={250} />
      <Text>No Preview Available</Text>
      <Text>{formatBytes(file.size)}</Text>
    </Box>
  );
};

export default FileAttachment;
