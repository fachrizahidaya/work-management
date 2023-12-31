import { View, Text, Pressable, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const FileAttachment = ({ file, setFile }) => {
  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];

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

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ width: 300, overflow: "hidden" }} numberOfLines={1} ellipsizeMode="tail">
          {file.name}
        </Text>
        <Pressable onPress={() => setFile(null)}>
          <MaterialCommunityIcons name="close" size={20} />
        </Pressable>
      </View>
      <View alignItems="center">
        <MaterialCommunityIcons
          name={
            formatMimeType(file.type) === "pdf"
              ? "file-pdf-box"
              : formatMimeType(file.type) === "pptx" || formatMimeType(file.type) === "ppt"
              ? "file-powerpoint-box"
              : formatMimeType(file.type) === "docx" || formatMimeType(file.type) === "doc"
              ? "file-word-box"
              : formatMimeType(file.type) === "xlsx" || formatMimeType(file.type) === "xls"
              ? "file-excel-box"
              : "text-box"
          }
          size={250}
          color="#595f69"
        />
        <Text>No Preview Available</Text>
        <Text>{formatBytes(file.size)}</Text>
      </View>
    </View>
  );
};

export default FileAttachment;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
