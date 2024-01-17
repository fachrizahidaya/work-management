import React, { memo, useCallback, useRef, useState } from "react";

import _ from "lodash";

import { TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";
import TaskFilterSheet from "../../../shared/ActionSheet/TaskFilterSheet";

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
  const filterSheetRef = useRef(null);
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

            <TouchableOpacity onPress={() => filterSheetRef.current?.show()}>
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
            </TouchableOpacity>
          </View>
        }
      />

      <TaskFilterSheet
        reference={filterSheetRef}
        deadlineSort={deadlineSort}
        labels={labels}
        members={members}
        responsibleId={responsibleId}
        selectedLabelId={selectedLabelId}
        selectedPriority={selectedPriority}
        setDeadlineSort={setDeadlineSort}
        setResponsibleId={setResponsibleId}
        setSelectedLabelId={setSelectedLabelId}
        setSelectedPriority={setSelectedPriority}
      />
    </>
  );
};

export default memo(TaskFilter);
