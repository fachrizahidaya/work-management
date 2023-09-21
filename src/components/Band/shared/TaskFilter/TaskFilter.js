import React, { memo, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Actionsheet, Button, Flex, FormControl, Icon, IconButton, Menu, Select, Text, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useFetch } from "../../../../hooks/useFetch";
import CustomSelect from "../../../shared/CustomSelect";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const TaskFilter = ({ data, fetchMemberUrl, fetchLabelUrl, setSelectedLabelId }) => {
  const [selectedLabel, setSelectedLabel] = useState("All Label");
  const { isOpen: filterIsOpen, toggle: toggleFilter } = useDisclosure(false);
  const { isOpen: memberMenuIsOpen, toggle: toggleMemberMenu } = useDisclosure(false);
  const { isOpen: labelMenuIsOpen, toggle: toggleLabelMenu } = useDisclosure(false);
  const { data: members } = useFetch(fetchMemberUrl);
  const { data: labels } = useFetch(fetchLabelUrl);

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
      console.log(values);
    },
  });

  const onPressMember = (member) => {
    formik.setFieldValue("responsible_name", member);
    toggleMemberMenu();
  };

  const onPressLabel = (label) => {
    if (label.label_name === "All Label") {
      setSelectedLabelId(null);
    } else {
      setSelectedLabelId(label.label_id);
    }
    setSelectedLabel(label.label_name);
    toggleLabelMenu();
  };

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
            <FormControl.Label>Member</FormControl.Label>
            <Select defaultValue={formik.values.responsible_name}>
              <Select.Item label="All Member" value="" />
              {members?.data?.length > 0 &&
                members.data.map((member) => {
                  return <Select.Item key={member.id} label={member.member_name} value={member.member_name} />;
                })}
            </Select>

            <FormControl.Label>Labels</FormControl.Label>
            <Select value={selectedLabel} isOpen={labelMenuIsOpen} toggle={toggleLabelMenu}>
              <Select.Item onPress={() => onPressLabel({ label_name: "All Label" })}>
                <Flex flexDir="row" alignItems="center" gap={3}>
                  <Text>All Label</Text>
                </Flex>
              </Select.Item>

              {labels?.data.map((label) => {
                return (
                  <Select.Item key={label.id} onPress={() => onPressLabel(label)}>
                    <Flex flexDir="row" alignItems="center" gap={3}>
                      <Text>{label.label_name}</Text>
                    </Flex>
                  </Select.Item>
                );
              })}
            </Select>

            <Button mt={4}>Reset Filter</Button>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default memo(TaskFilter);
