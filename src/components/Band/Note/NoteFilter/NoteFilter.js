import React, { memo, useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { Actionsheet, Button, FormControl, Icon, IconButton, Input, Pressable, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../hooks/useDisclosure";

const NoteFilter = ({ data = [], setFilteredData }) => {
  const { isOpen: filterIsOpen, toggle: toggleFilter } = useDisclosure(false);

  let filteredArr = data;

  const formik = useFormik({
    enableReinitialize: true,
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
      w="100%"
      size="md"
      placeholder="Searcg note..."
      value={formik.values.title}
      onChangeText={(value) => {
        formik.setFieldValue("title", value);
        formik.handleSubmit();
      }}
      InputRightElement={
        formik.values.title && (
          <Pressable
            onPress={() => {
              formik.resetForm();
            }}
          >
            <Icon as={<MaterialCommunityIcons name="close" />} size="md" mr={3} />
          </Pressable>
        )
      }
    />
  );
};

export default memo(NoteFilter);
