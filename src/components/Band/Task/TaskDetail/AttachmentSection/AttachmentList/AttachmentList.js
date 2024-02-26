import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../../../../shared/CustomStylings";

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
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        marginRight: 10,
        paddingBottom: 10,
      }}
    >
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
          <Text style={TextProps}>{title.length > 10 ? title.slice(0, 10) + "..." : title}</Text>

          {time && (
            <Text style={[{ opacity: 0.5, maxWidth: 150 }, TextProps]} numberOfLines={2}>
              {time}
            </Text>
          )}
          <Text style={[{ opacity: 0.5 }, TextProps]}>{size}</Text>
        </View>
      </View>

      <Pressable
        onPress={() =>
          SheetManager.show("form-sheet", {
            payload: {
              children: (
                <View style={styles.menu}>
                  <View style={styles.wrapper}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => downloadFileHandler(path)}>
                      <Text style={[TextProps, { fontSize: 16 }]}>Download</Text>
                      <MaterialCommunityIcons name="download-outline" size={20} color="#176688" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.wrapper}>
                    {!disabled && (
                      <TouchableOpacity
                        style={[styles.menuItem, { marginTop: 3 }]}
                        onPress={() => deleteFileHandler(id, from)}
                      >
                        <Text style={{ color: "red", fontSize: 16, fontWeight: 700 }}>Delete</Text>
                        <MaterialCommunityIcons name="delete-outline" size={20} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ),
            },
          })
        }
      >
        <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  wrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});

export default AttachmentList;
