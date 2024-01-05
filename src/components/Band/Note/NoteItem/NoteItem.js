import React, { memo } from "react";

import dayjs from "dayjs";
import { SheetManager } from "react-native-actions-sheet";

import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../../hooks/useCheckAccess";
import { TextProps } from "../../../shared/CustomStylings";

const NoteItem = ({ note, id, title, date, isPinned, onPress, openDeleteModal, openEditForm }) => {
  const deleteCheckAccess = useCheckAccess("delete", "Notes");

  return (
    <Pressable onPress={() => openEditForm(note)}>
      <View style={styles.card}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderStyle: Platform.OS === "android" && "dashed",
            borderBottomWidth: Platform.OS === "android" && 2.5,
            paddingBottom: Platform.OS === "android" && 18,
            borderColor: Platform.OS === "android" && "#E8E9EB",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <MaterialCommunityIcons name="calendar-month" size={20} color="#3F434A" />

            <Text style={[{ fontWeight: 500 }, TextProps]}>{dayjs(date).format("DD MMMM, YYYY")}</Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Pressable
              style={{ borderRadius: 50 }}
              onPress={() => onPress({ ...note, status: !isPinned ? "pinned" : "unpinned" })}
            >
              <MaterialCommunityIcons
                name={!isPinned ? "pin-outline" : "pin"}
                style={{
                  transform: [{ rotate: "45deg" }],
                }}
                size={20}
                color="#3F434A"
              />
            </Pressable>

            {deleteCheckAccess && (
              <Pressable
                style={{ borderRadius: 50 }}
                onPress={() =>
                  SheetManager.show("form-sheet", {
                    payload: {
                      children: (
                        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                          <TouchableOpacity
                            onPress={async () => {
                              await SheetManager.hide("form-sheet");
                              openDeleteModal(note);
                            }}
                          >
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                              <MaterialCommunityIcons name="delete-outline" color="red" size={20} />
                              <Text style={{ color: "red", fontWeight: 500 }}>Delete</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ),
                    },
                  })
                }
              >
                <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" />
              </Pressable>
            )}
          </View>
        </View>

        {Platform.OS === "ios" && (
          <View style={{ overflow: "hidden" }}>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "#E8E9EB",
                margin: -2,
                marginTop: 0,
                height: 5,
              }}
            />
          </View>
        )}

        <Text style={[{ fontWeight: 500 }, TextProps]}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default memo(NoteItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    display: "flex",
    gap: 20,
  },
});
