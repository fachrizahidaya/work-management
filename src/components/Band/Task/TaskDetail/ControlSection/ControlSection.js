import React, { memo } from "react";

import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import Button from "../../../../shared/Forms/Button";

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
                  <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                    <TouchableOpacity
                      onPress={async () => {
                        await onChangeStatus("open");
                        SheetManager.hide("form-sheet");
                      }}
                      disabled={isLoading}
                    >
                      <Text style={{ opacity: 500 }}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await onChangeStatus("start");
                        SheetManager.hide("form-sheet");
                      }}
                      disabled={isLoading}
                    >
                      <Text style={{ opacity: 500 }}>On Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await onChangeStatus("finish");
                        SheetManager.hide("form-sheet");
                      }}
                      disabled={isLoading}
                    >
                      <Text style={{ opacity: 500 }}>Finish</Text>
                    </TouchableOpacity>
                  </View>
                ),
              },
            })
          }
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
            {isLoading ? <ActivityIndicator /> : <Text style={{ fontWeight: 500, color: "white" }}>{taskStatus}</Text>}
          </View>
        </Button>
      </View>
    </>
  );
};

export default memo(ControlSection);
