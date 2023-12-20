import React, { memo, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";

import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../hooks/useDisclosure";

const StatusSection = ({ projectData, onChange }) => {
  const userSelector = useSelector((state) => state.auth);
  const [value, setValue] = useState("");
  const { isOpen, toggle, close } = useDisclosure(false);
  const statuses = ["Open", "On Progress", "Complete"];

  useEffect(() => {
    if (projectData) {
      setValue(projectData.status);
    }

    return () => {
      close();
    };
  }, [projectData]);
  return (
    <>
      <Pressable
        style={{ flex: 1 }}
        onPress={() =>
          SheetManager.show("form-sheet", {
            payload: {
              children: (
                <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                  {statuses.map((status) => {
                    return (
                      <TouchableOpacity
                        key={status}
                        onPress={() => {
                          if (status !== "Open") {
                            setValue(status);
                            toggle();
                            onChange(status === "On Progress" ? "start" : "finish");
                            SheetManager.hide("form-sheet");
                          }
                        }}
                      >
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor:
                                status === "Open" ? "#FFD240" : status === "On Progress" ? "#20cce2" : "#49c86c",
                              borderRadius: 4,
                            }}
                          />
                          <Text style={{ fontSize: 16 }}>{status}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ),
            },
          })
        }
        disabled={projectData?.owner_id !== userSelector.id}
      >
        <View
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "#cbcbcb",
            borderRadius: 10,
            paddingHorizontal: 10,
            backgroundColor: "#F8F8F8",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                height: 15,
                width: 15,
                backgroundColor: value === "Open" ? "#FFD240" : value === "On Progress" ? "#20cce2" : "#49c86c",
                borderRadius: 4,
              }}
            />

            <Text style={{ fontWeight: 500 }}>{value}</Text>
          </View>

          {projectData?.owner_id === userSelector.id && (
            <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={20} />
          )}
        </View>
      </Pressable>
    </>
  );
};

export default memo(StatusSection);
