import React, { memo, useEffect, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { Actionsheet, Button, FormControl, Icon, IconButton, Input, Select, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../hooks/useDisclosure";

const TaskFilter = ({ data = [], members, labels, setSelectedLabelId, setFilteredData }) => {
  const [selectedLabel, setSelectedLabel] = useState("");
  const { isOpen: filterIsOpen, toggle: toggleFilter } = useDisclosure(false);

  let filteredArr = data;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      priority: "",
      deadline: "",
      responsible_name: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string(),
      priority: yup.string(),
      deadline: yup.string(),
      responsible_name: yup.string(),
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
      if (filterObj[key] === "asc" || filterObj[key] === "desc") {
        // Sorting: Sort the data by the "deadline" property in ascending or descending order.
        filteredArr = _.orderBy(filteredArr, ["deadline"], [filterObj[key]]);
      } else if (filterObj[key]) {
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

  const onPressMember = (member) => {
    formik.setFieldValue("responsible_name", member);
    formik.handleSubmit();
  };

  const onPressLabel = (label) => {
    setSelectedLabelId(label);
    setSelectedLabel(label);
  };

  // Run filter on initial render so the first render will return all data
  useEffect(() => {
    filterDataHandler(formik.values);
  }, [formik.values, filteredArr.length]);

  return (
    <>
      <IconButton
        onPress={toggleFilter}
        icon={<Icon as={<MaterialCommunityIcons name="tune-variant" />} color="#3F434A" />}
        rounded="full"
        size="md"
      />

      {filterIsOpen && (
        <Actionsheet isOpen={filterIsOpen} onClose={toggleFilter}>
          <Actionsheet.Content>
            <VStack w="95%" space={2}>
              {/* Search Bar */}
              <FormControl.Label>Search Task</FormControl.Label>
              <Input
                placeholder="Type anything..."
                value={formik.values.title}
                onChangeText={(value) => {
                  formik.setFieldValue("title", value);
                  formik.handleSubmit();
                }}
              />

              {/* Member */}
              <FormControl.Label>Member</FormControl.Label>
              <Select onValueChange={(value) => onPressMember(value)} defaultValue={formik.values.responsible_name}>
                <Select.Item label="All Member" value="" />
                <Select.Item label="Not Assigned" value="null" />
                {members?.length > 0 &&
                  members.map((member, index) => {
                    return (
                      <Select.Item
                        key={index}
                        label={member.member_name || member}
                        value={member.member_name || member}
                      />
                    );
                  })}
              </Select>

              {/* Label */}
              <FormControl.Label>Label</FormControl.Label>
              <Select
                defaultValue={selectedLabel}
                onValueChange={(value) => {
                  onPressLabel(value);
                  formik.handleSubmit();
                }}
              >
                <Select.Item label="No Label" value="" />

                {labels?.data.map((label) => {
                  return (
                    <Select.Item
                      key={label.id}
                      label={label.label_name || label.name}
                      value={label.label_id || label.id}
                    />
                  );
                })}
              </Select>

              {/* Deadline */}
              <FormControl.Label>Due Date</FormControl.Label>
              <Select
                defaultValue={formik.values.deadline}
                onValueChange={(value) => {
                  formik.setFieldValue("deadline", value);
                  formik.handleSubmit();
                }}
              >
                <Select.Item label="Due anytime" value="" />
                <Select.Item label="Closest" value="asc" />
                <Select.Item label="Latest" value="desc" />
              </Select>

              {/* Priority */}
              <FormControl.Label>Priority</FormControl.Label>
              <Select
                defaultValue={formik.values.priority}
                onValueChange={(value) => {
                  formik.setFieldValue("priority", value);
                  formik.handleSubmit();
                }}
              >
                <Select.Item label="All Priority" value="" />
                <Select.Item label="Low" value="Low" />
                <Select.Item label="Medium" value="Medium" />
                <Select.Item label="High" value="High" />
              </Select>

              <Button
                mt={4}
                onPress={() => {
                  formik.handleReset();

                  // Reset labels
                  setSelectedLabel("");
                  setSelectedLabelId(null);
                }}
              >
                Reset Filter
              </Button>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>
      )}
    </>
  );
};

export default memo(TaskFilter);
