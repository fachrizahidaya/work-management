import React, { useEffect, useState } from "react";

import { Image, Linking, Pressable, Text, View } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const doc = "../../../assets/doc-icons/doc-format.png";
const pdf = "../../../assets/doc-icons/pdf-format.png";
const ppt = "../../../assets/doc-icons/ppt-format.png";
const xls = "../../../assets/doc-icons/xls-format.png";
const txt = "../../../assets/doc-icons/other-format.png";

const DocItem = ({ image, path, type, size }) => {
  const [fileImage, setFileImage] = useState("");
  const fileDict = [
    { type: "docx", image: doc },
    { type: "xlsx", image: xls },
    { type: "pptx", image: ppt },
    { type: "doc", image: doc },
    { type: "xls", image: xls },
    { type: "ppt", image: ppt },
    { type: "pdf", image: pdf },
    { type: "txt", image: txt },
  ];

  const getFileExt = () => {
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  let extension = getFileExt();

  const getFileImage = () => {
    const type = getFileExt();
    const fileDictObj = fileDict.find((obj) => obj.type == type);
    if (fileDictObj) return setFileImage(fileDictObj.image);
  };

  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(
        `${process.env.EXPO_PUBLIC_API}/download/${file_path}`,
        "_blank"
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFileImage();
  }, [type]);

  return (
    <Pressable
      onPress={() => attachmentDownloadHandler(path)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 5,
      }}
    >
      <Image
        source={
          getFileExt() === "doc" ||
          getFileExt() === "docx" ||
          extension.includes("word")
            ? require(doc)
            : getFileExt() === "pdf"
            ? require(pdf)
            : getFileExt() === "xls" ||
              getFileExt() === "xlsx" ||
              extension.includes("spreadsheet")
            ? require(xls)
            : getFileExt() === "ppt" ||
              getFileExt() === "pptx" ||
              extension.includes("powerpoint") ||
              extension.includes("presentation")
            ? require(ppt)
            : require(txt)
        }
        style={{
          height: 50,
          width: 50,
          alignSelf: "center",
          resizeMode: "cover",
        }}
        alt={`${type} format`}
      />
      <View>
        <Text
          style={[{ fontSize: 14, overflow: "hidden", width: 300 }, TextProps]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {image}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Text
            style={[
              { fontSize: 10, opacity: 0.5, overflow: "hidden", width: 25 },
              TextProps,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getFileExt()}
          </Text>
          <Text>•</Text>
          <Text style={[{ fontSize: 10, opacity: 0.5 }, TextProps]}>
            {size}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default DocItem;
