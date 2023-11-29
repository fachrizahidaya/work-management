import React, { useEffect, useState } from "react";

const AttachmentPreview = ({ file }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const imgTypes = ["jpg", "jpeg", "png"];
  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  useEffect(() => {
    if (file && imgTypes.includes(formatMimeType(file.type))) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      return () => URL.revokeObjectURL(file);
    }
  }, [file]);

  return (
    <Flex px={5} py={5} gap={5} bgColor="white" position="absolute" top={0} bottom={0} left={0} right={0}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text numberOfLines={1} width={300} overflow="hidden">
          {file.name}
        </Text>
        <Pressable onPress={() => setFile(null)}>
          <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
        </Pressable>
      </Flex>
      <Box alignItems="center">
        <Icon as={<MaterialCommunityIcons name="file-pdf-box" />} size={250} />
        <Text>No Preview Available</Text>
        <Text>{formatBytes(file.size)}</Text>
      </Box>
    </Flex>
  );
};

export default AttachmentPreview;
