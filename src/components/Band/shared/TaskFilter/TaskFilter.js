import React, { memo, useCallback, useState } from "react";

import _ from "lodash";
import { SheetManager } from "react-native-actions-sheet";

import { TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";
import Select from "../../../shared/Forms/Select";

const TaskFilter = ({
  members,
  labels,
  setSelectedLabelId,
  selectedLabelId,
  responsibleId,
  deadlineSort,
  selectedPriority,
  setResponsibleId,
  setDeadlineSort,
  setSelectedPriority,
  setSearchInput,
}) => {
  const [shownInput, setShownInput] = useState("");

  const handleChangeInput = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 300),
    []
  );

  return (
    <>
      <Input
        value={shownInput}
        onChangeText={(value) => {
          handleChangeInput(value);
          setShownInput(value);
        }}
        placeHolder="Search task..."
        endAdornment={
          <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
            {shownInput && (
              <TouchableOpacity
                onPress={() => {
                  setSearchInput("");
                  setShownInput("");
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() =>
                SheetManager.show("form-sheet", {
                  payload: {
                    children: (
                      <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                        <Select
                          value={responsibleId}
                          placeHolder="Select Member"
                          items={[
                            { value: "all", label: "All Member" },
                            { value: "", label: "Not Assigned" },
                            ...(Array.isArray(members) &&
                              members.map((member) => {
                                return {
                                  value: member.user_id || member.responsible_id,
                                  label: member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0],
                                };
                              })),
                          ]}
                          onChange={(value) => setResponsibleId(value)}
                          hasParentSheet
                        />
                        <Select
                          value={selectedLabelId}
                          placeHolder="Select Label"
                          items={[
                            { value: "", label: "No Label" },
                            ...(Array.isArray(labels?.data) &&
                              labels?.data.map((label) => {
                                return {
                                  value: label.label_id,
                                  label: label.label_name,
                                };
                              })),
                          ]}
                          onChange={(value) => setSelectedLabelId(value)}
                          hasParentSheet
                        />
                        <Select
                          value={deadlineSort}
                          placeHolder="Sort Deadline"
                          items={[
                            { value: "asc", label: "Closest" },
                            { value: "desc", label: "Latest" },
                          ]}
                          onChange={(value) => setDeadlineSort(value)}
                          hasParentSheet
                        />
                        <Select
                          value={selectedPriority}
                          placeHolder="Select Priority"
                          items={[
                            { value: "", label: "All Priority" },
                            { value: "Low", label: "Low" },
                            { value: "Medium", label: "Medium" },
                            { value: "High", label: "High" },
                          ]}
                          onChange={(value) => setSelectedPriority(value)}
                          hasParentSheet
                        />
                      </View>
                    ),
                  },
                })
              }
            >
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
            </TouchableOpacity>
          </View>
        }
      />
    </>
  );
};

export default memo(TaskFilter);
