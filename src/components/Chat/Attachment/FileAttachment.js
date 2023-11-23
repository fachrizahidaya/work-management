import { Box, Flex, Icon, Pressable, Text } from "native-base";

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
    <Flex px={5} py={5} gap={5} bgColor="white" position="absolute" top="80px" bottom="60px" left={0} right={0}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text numberOfLines={1} width={300} overflow="hidden">
          {file.name}
        </Text>
        <Pressable onPress={() => setFile(null)}>
          <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
        </Pressable>
      </Flex>
      <Box mt={100} alignItems="center">
        <Icon as={<MaterialCommunityIcons name="file-pdf-box" />} size={250} />
        <Text>No Preview Available</Text>
        <Text>{formatBytes(file.size)}</Text>
      </Box>
    </Flex>
  );
};

export default FileAttachment;
