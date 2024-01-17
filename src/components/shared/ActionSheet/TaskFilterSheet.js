import React from "react";

import _ from "lodash";
import ActionSheet from "react-native-actions-sheet";

import { StyleSheet, Text, View } from "react-native";
import Select from "../Forms/Select";
import Button from "../Forms/Button";

const TaskFilterSheet = ({
  reference,
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
}) => {
  const resetAllFilter = () => {
    setResponsibleId("all");
    setSelectedLabelId(null);
    setDeadlineSort("asc");
    setSelectedPriority("");
  };

  return (
    <ActionSheet ref={reference}>
      <View style={styles.container}>
        <Select
          title="Responsible"
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
        />
        <Select
          title="Label"
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
        />
        <Select
          title="Sort Deadline"
          value={deadlineSort}
          placeHolder="Sort Deadline"
          items={[
            { value: "asc", label: "Closest" },
            { value: "desc", label: "Latest" },
          ]}
          onChange={(value) => setDeadlineSort(value)}
        />
        <Select
          title="Priority"
          value={selectedPriority}
          placeHolder="Select Priority"
          items={[
            { value: "", label: "All Priority" },
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
          ]}
          onChange={(value) => setSelectedPriority(value)}
        />

        <Button onPress={() => resetAllFilter()}>
          <Text style={{ color: "#fff" }}>Reset Filter</Text>
        </Button>
      </View>
    </ActionSheet>
  );
};

export default TaskFilterSheet;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
