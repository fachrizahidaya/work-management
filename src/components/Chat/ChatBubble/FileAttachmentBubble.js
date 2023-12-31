import { useState, useEffect } from "react";

import { View, Text, Pressable, Image, Linking } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const doc = "../../../assets/doc-icons/doc-format.png";
const pdf = "../../../assets/doc-icons/pdf-format.png";
const ppt = "../../../assets/doc-icons/ppt-format.png";
const xls = "../../../assets/doc-icons/xls-format.png";

const FileAttachmentBubble = ({ file_type, file_name, file_path, file_size, myMessage }) => {
  const [fileImage, setFileImage] = useState("");
  const fileDict = [
    { type: "docx", image: doc },
    { type: "xlsx", image: xls },
    { type: "pptx", image: ppt },
    { type: "doc", image: doc },
    { type: "xls", image: xls },
    { type: "ppt", image: ppt },
    { type: "pdf", image: pdf },
  ];

  const getFileExt = () => {
    const typeArr = file_type.split("/");
    return typeArr.pop();
  };

  const getFileImage = () => {
    const type = getFileExt();
    const fileDictObj = fileDict.find((obj) => obj.type == type);
    if (fileDictObj) return setFileImage(fileDictObj.image);
  };

  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFileImage();
  }, [file_type]);

  return (
    <Pressable
      onPress={() => attachmentDownloadHandler(file_path)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: !myMessage ? "#f1f1f1" : "#1b536b",
        borderRadius: 5,
        gap: 5,
        padding: 5,
      }}
    >
      <Image
        source={
          getFileExt() === "doc"
            ? require(doc)
            : getFileExt() === "pdf"
            ? require(pdf)
            : getFileExt() === "xls" || getFileExt() === "xlsx"
            ? require(xls)
            : getFileExt() === "ppt" || getFileExt() === "pptxs"
            ? require(ppt)
            : null
        }
        style={{
          height: 8,
          width: 8,
          alignSelf: "center",
          resizeMode: "cover",
        }}
        alt={`${file_type} format`}
      />

      <View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: !myMessage ? "#000000" : "#FFFFFF",
            width: 160,
            overflow: "hidden",
          }}
          numberOfLines={2}
          overflow="hidden"
          ellipsizeMode="tail"
        >
          {file_name}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: "400", color: !myMessage ? "#000000" : "#FFFFFF" }}>
          {getFileExt()} • {file_size}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="download"
        color={!myMessage ? "#000000" : "#FFFFFF"}
        size={10}
        onPress={() => attachmentDownloadHandler(file_path)}
      />
    </Pressable>
  );
};

export default FileAttachmentBubble;
