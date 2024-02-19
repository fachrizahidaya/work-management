import React, { memo } from "react";

import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Button from "../../../../shared/Forms/Button";
import { TextProps } from "../../../../shared/CustomStylings";

const ControlSection = ({ taskStatus, selectedTask, onChangeStatus, isLoading }) => {
  const userSelector = useSelector((state) => state.auth);
  const isDisabled = taskStatus === "Closed";

  return (
    <>
      <View>
        <Button
          disabled={isDisabled || selectedTask?.responsible_id !== userSelector.id}
          styles={{ alignSelf: "flex-start", paddingHorizontal: 8 }}
          onPress={() =>
            SheetManager.show("form-sheet", {
              payload: {
                children: (
                  <View style={styles.menu}>
                    <View style={styles.wrapper}>
                      <TouchableOpacity
                        onPress={async () => {
                          await onChangeStatus("open");
                          SheetManager.hide("form-sheet");
                        }}
                        disabled={isLoading}
                        style={styles.menuItem}
                      >
                        <Text style={(TextProps, { fontSize: 16 })}>Open</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          await onChangeStatus("start");
                          SheetManager.hide("form-sheet");
                        }}
                        disabled={isLoading}
                        style={styles.menuItem}
                      >
                        <Text style={(TextProps, { fontSize: 16 })}>On Progress</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          await onChangeStatus("finish");
                          SheetManager.hide("form-sheet");
                        }}
                        disabled={isLoading}
                        style={styles.menuItem}
                      >
                        <Text style={(TextProps, { fontSize: 16 })}>Finish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ),
              },
            })
          }
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
            {isLoading ? <ActivityIndicator /> : <Text style={{ color: "white" }}>{taskStatus}</Text>}
          </View>
        </Button>
      </View>
    </>
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

export default memo(ControlSection);
