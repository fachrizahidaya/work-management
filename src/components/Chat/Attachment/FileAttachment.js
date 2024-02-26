import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

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
    const sizes = [
      "Bytes",
      "KiB",
      "MiB",
      "GiB",
      "TiB",
      "PiB",
      "EiB",
      "ZiB",
      "YiB",
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: Platform.OS === "ios" ? 60 : null,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[{ fontSize: 12, width: 300, overflow: "hidden" }, TextProps]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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
              : formatMimeType(file.type) === "pptx" ||
                formatMimeType(file.type) === "ppt" ||
                formatMimeType(file.type) === "powerpoint" ||
                formatMimeType(file.type) === "presentation"
              ? "file-powerpoint-box"
              : formatMimeType(file.type) === "docx" ||
                formatMimeType(file.type) === "doc" ||
                formatMimeType(file.type) === "document"
              ? "file-word-box"
              : formatMimeType(file.type) === "xlsx" ||
                formatMimeType(file.type) === "xls" ||
                formatMimeType(file.type) === "spreadsheet"
              ? "file-excel-box"
              : "text-box"
          }
          size={250}
          color="#595f69"
        />
        <Text style={[{ fontSize: 12 }, TextProps]}>No Preview Available</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>
          {formatBytes(file.size)}
        </Text>
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
