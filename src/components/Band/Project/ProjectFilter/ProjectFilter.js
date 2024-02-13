import React, { useCallback, useRef } from "react";

import { useFormik } from "formik";
import _ from "lodash";

import { View, Pressable, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";
import ProjectFilterSheet from "../../../shared/ActionSheet/ProjectFilterSheet";

const ProjectFilter = ({
  deadlineSort,
  selectedPriority,
  setSearchInput,
  setDeadlineSort,
  setSelectedPriority,
  setOwnerName,
}) => {
  const filterSheetRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 500),
    []
  );

  return (
    <>
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
                    formik.setFieldValue("search", "");
                  }}
                >
                  <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
                </Pressable>
              )}

              <TouchableOpacity onPress={() => filterSheetRef.current?.show()}>
                <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <ProjectFilterSheet
        reference={filterSheetRef}
        deadlineSort={deadlineSort}
        selectedPriority={selectedPriority}
        setDeadlineSort={setDeadlineSort}
        setOwnerName={setOwnerName}
        setSelectedPriority={setSelectedPriority}
      />
    </>
  );
};

export default ProjectFilter;
