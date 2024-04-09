import { View, Text, Pressable, Image, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const doc = "../../../assets/doc-icons/doc-format.png";
const pdf = "../../../assets/doc-icons/pdf-format.png";
const ppt = "../../../assets/doc-icons/ppt-format.png";
const xls = "../../../assets/doc-icons/xls-format.png";
const txt = "../../../assets/doc-icons/other-format.png";

const FileAttachmentBubble = ({
  file_type,
  file_name,
  file_path,
  file_size,
  myMessage,
  getFileExt,
  extension,
  onDownload,
}) => {
  return getFileExt() === "jpg" || getFileExt() === "jpeg" || getFileExt() === "png" ? null : (
    <Pressable
      onPress={() => onDownload(file_path)}
      style={{
        ...styles.container,
        backgroundColor: !myMessage ? "#f1f1f1" : "#1b536b",
      }}
    >
      <Image
        source={
          getFileExt() === "doc" || getFileExt() === "docx" || extension?.includes("word")
            ? require(doc)
            : getFileExt() === "pdf"
            ? require(pdf)
            : getFileExt() === "xls" || getFileExt() === "xlsx" || extension?.includes("spreadsheet")
            ? require(xls)
            : getFileExt() === "ppt" ||
              getFileExt() === "pptx" ||
              extension?.includes("powerpoint") ||
              extension?.includes("presentation")
            ? require(ppt)
            : require(txt)
        }
        style={styles.image}
        alt={`${file_type} format`}
      />

      <View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: !myMessage ? "#3F434A" : "#FFFFFF",
            width: 160,
            overflow: "hidden",
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {file_name}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "400",
            width: 150,
            color: !myMessage ? "#3F434A" : "#FFFFFF",
            overflow: "hidden",
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {getFileExt()} • {file_size}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="download"
        color={!myMessage ? "#3F434A" : "#FFFFFF"}
        size={20}
        onPress={() => attachmentDownloadHandler(file_path)}
      />
    </Pressable>
  );
};

export default FileAttachmentBubble;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    gap: 5,
    padding: 10,
  },
  image: {
    height: 20,
    width: 20,
    alignSelf: "center",
    resizeMode: "cover",
  },
});
