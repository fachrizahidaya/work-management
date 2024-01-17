import { useCallback } from "react";

import ActionSheet from "react-native-actions-sheet";
import { useFormik } from "formik";
import _ from "lodash";

import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "../Forms/Input";
import Select from "../Forms/Select";
import Button from "../Forms/Button";

const ProjectFilterSheet = ({
  reference,
  deadlineSort,
  selectedPriority,
  setDeadlineSort,
  setSelectedPriority,
  setOwnerName,
}) => {
  const formik = useFormik({
    initialValues: {
      owner_name: "",
    },
  });

  const handleSearchOwner = useCallback(
    _.debounce((value) => {
      setOwnerName(value);
    }, 500),
    []
  );

  const resetAllFilter = () => {
    formik.setFieldValue("owner_name", "");
    setOwnerName("");
    setDeadlineSort("asc");
    setSelectedPriority("");
  };
  return (
    <ActionSheet ref={reference}>
      <View style={styles.container}>
        <Input
          value={formik.values.owner_name}
          title="Owner Name"
          onChangeText={(value) => {
            handleSearchOwner(value);
            formik.setFieldValue("owner_name", value);
          }}
          placeHolder="Search owner..."
          endAdornment={
            formik.values.owner_name && (
              <Pressable
                onPress={() => {
                  handleSearchOwner("");
                  formik.setFieldValue("owner_name", "");
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
              </Pressable>
            )
          }
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
          hasParentSheet
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
          hasParentSheet
        />

        <Button onPress={async () => resetAllFilter()}>
          <Text style={{ color: "#fff" }}>Reset Filter</Text>
        </Button>
      </View>
    </ActionSheet>
  );
};

export default ProjectFilterSheet;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
