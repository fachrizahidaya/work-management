import React, { useCallback } from "react";

import { useFormik } from "formik";
import _ from "lodash";
import { SheetManager } from "react-native-actions-sheet";

import { View, Pressable, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";
import Select from "../../../shared/Forms/Select";

const ProjectFilter = ({
  deadlineSort,
  selectedPriority,
  setSearchInput,
  setCurrentPage,
  setDeadlineSort,
  setSelectedPriority,
}) => {
  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 500),
    []
  );
  return (
    <View style={{ paddingTop: 4, paddingHorizontal: 16 }}>
      <Input
        value={formik.values.search}
        onChangeText={(value) => {
          handleSearch(value);
          formik.setFieldValue("search", value);
        }}
        placeHolder="Search project..."
        endAdornment={
          <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
            {formik.values.search && (
              <Pressable
                onPress={() => {
                  handleSearch("");
                  formik.resetForm();
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
              </Pressable>
            )}

            <TouchableOpacity
              onPress={() =>
                SheetManager.show("form-sheet", {
                  payload: {
                    children: (
                      <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
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
        startAdornment={
          <Pressable>
            <MaterialCommunityIcons name="magnify" size={20} color="#3F434A" />
          </Pressable>
        }
      />
    </View>
  );
};

export default ProjectFilter;
