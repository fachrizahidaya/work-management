import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttachmentList = ({
  id,
  title,
  from,
  size,
  time,
  type = "",
  downloadFileHandler,
  deleteFileHandler,
  iconHeight,
  iconWidth,
  path,
  disabled,
}) => {
  const doc = "../../../../../../assets/doc-icons/doc-format.png";
  const gif = "../../../../../../assets/doc-icons/gif-format.png";
  const jpg = "../../../../../../assets/doc-icons/jpg-format.png";
  const key = "../../../../../../assets/doc-icons/key-format.png";
  const other = "../../../../../../assets/doc-icons/other-format.png";
  const pdf = "../../../../../../assets/doc-icons/pdf-format.png";
  const png = "../../../../../../assets/doc-icons/png-format.png";
  const ppt = "../../../../../../assets/doc-icons/ppt-format.png";
  const rar = "../../../../../../assets/doc-icons/rar-format.png";
  const xls = "../../../../../../assets/doc-icons/xls-format.png";
  const zip = "../../../../../../assets/doc-icons/zip-format.png";
  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Image
          style={{ height: iconHeight || 50, width: iconWidth || 50, resizeMode: "contain" }}
          source={
            type.includes("doc")
              ? require(doc)
              : type.includes("gif")
              ? require(gif)
              : type.includes("jpg") || type.includes("jpeg")
              ? require(jpg)
              : type.includes("key")
              ? require(key)
              : type.includes("pdf")
              ? require(pdf)
              : type.includes("png")
              ? require(png)
              : type.includes("ppt") || type.includes("pptx")
              ? require(ppt)
              : type.includes("rar")
              ? require(rar)
              : type.includes("xls") || type.includes("xlsx")
              ? require(xls)
              : type.includes("zip")
              ? require(zip)
              : require(other)
          }
          alt="file icon"
        />

        <View>
          <Text style={{ fontWeight: 500 }}>{title.length > 30 ? title.slice(0, 30) + "..." : title}</Text>

          {time && (
            <Text style={{ fontWeight: 500, opacity: 0.5, maxWidth: 150 }} numberOfLines={2}>
              {time}
            </Text>
          )}
          <Text style={{ fontWeight: 500, opacity: 0.5 }}>{size}</Text>
        </View>
      </View>

      <Pressable
        onPress={() =>
          SheetManager.show("form-sheet", {
            payload: {
              children: (
                <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                  <TouchableOpacity
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
                    onPress={() => downloadFileHandler(path)}
                  >
                    <MaterialCommunityIcons name="download-outline" size={20} />
                    <Text style={{ fontWeight: 500 }}>Download</Text>
                  </TouchableOpacity>

                  {!disabled && (
                    <TouchableOpacity
                      style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
                      onPress={() => deleteFileHandler(id, from)}
                    >
                      <MaterialCommunityIcons name="delete-outline" size={20} color="red" />
                      <Text style={{ fontWeight: 500, color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ),
            },
          })
        }
      >
        <MaterialCommunityIcons name="dots-vertical" size={20} />
      </Pressable>
    </View>
  );
};

export default AttachmentList;
