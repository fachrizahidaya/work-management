import React, { memo, useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";

const NoteFilter = ({ data = [], setFilteredData }) => {
  let filteredArr = data;

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string(),
    }),
    onSubmit: (values) => {
      filterDataHandler(values);
    },
  });

  /**
   * Filter and sort data based on filter criteria.
   * @param {Object} filterObj - An object containing filter criteria.
   */
  const filterDataHandler = (filterObj) => {
    // Iterate through the keys of the filterObj
    Object.keys(filterObj).forEach((key) => {
      if (filterObj[key]) {
        // Filtering: Filter the data based on the filter value (case-insensitive).
        filteredArr = _.filter(filteredArr, (val) => {
          return (
            val[key]?.toLowerCase()?.includes(filterObj[key]?.toLowerCase()) ||
            (filterObj[key] === "null" && val[key] === null)
          );
        });
      }
      // Update the state or result with the filtered and sorted data.
      setFilteredData(filteredArr);
    });
  };

  // Run filter on initial render so the first render will return all data
  useEffect(() => {
    filterDataHandler(formik.values);
  }, [formik.values, filteredArr]);
  return (
    <Input
      placeHolder="Search note..."
      formik={formik}
      value={formik.values.title}
      fieldName="title"
      onChangeText={(value) => {
        formik.setFieldValue("title", value);
        formik.handleSubmit();
      }}
      endAdornment={
        formik.values.title && (
          <Pressable
            onPress={() => {
              formik.resetForm();
            }}
          >
            <MaterialCommunityIcons name="close" size={20} />
          </Pressable>
        )
      }
    />
  );
};

export default memo(NoteFilter);
