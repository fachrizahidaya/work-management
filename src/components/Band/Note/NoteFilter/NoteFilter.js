import React, { memo, useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { Actionsheet, Button, FormControl, Icon, IconButton, Input, VStack } from "native-base";
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
    <>
      <IconButton
        onPress={toggleFilter}
        icon={<Icon as={<MaterialCommunityIcons name="tune-variant" />} color="#3F434A" />}
        rounded="full"
        size="md"
      />

      <Actionsheet isOpen={filterIsOpen} onClose={toggleFilter}>
        <Actionsheet.Content>
          <VStack w="95%" space={2}>
            {/* Search Bar */}
            <FormControl.Label>Search Note</FormControl.Label>
            <Input
              placeholder="Type anything..."
              value={formik.values.title}
              onChangeText={(value) => {
                formik.setFieldValue("title", value);
                formik.handleSubmit();
              }}
            />

            <Button
              mt={4}
              onPress={() => {
                formik.handleReset();
              }}
            >
              Reset Filter
            </Button>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default memo(NoteFilter);
