import React from "react";
import { Dimensions, Platform } from "react-native";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Select, Button } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import CustomSelect from "../../../shared/CustomSelect";

const NewProjectSlider = ({ isOpen, setIsOpen }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Project
          </Text>
        </Flex>

        <Flex gap={17} mt={22}>
          <FormControl
          // isInvalid={formik.errors.email}
          >
            <FormControl.Label>Project Name</FormControl.Label>
            <Input
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              // onChangeText={(value) => formik.setFieldValue("email", value)}
              placeholder="App Development"
            />
            {/* <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl
          // isInvalid={formik.errors.email}
          >
            <FormControl.Label>Description</FormControl.Label>
            <Input
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              multiline
              h={100}
              // onChangeText={(value) => formik.setFieldValue("email", value)}
              placeholder="Create a mobile application on iOS and Android devices."
            />
            {/* <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl>
            <FormControl.Label>End Date</FormControl.Label>
            <CustomDateTimePicker />
            {/* <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl>
            <FormControl.Label>Priority</FormControl.Label>
            <Select
              borderRadius={15}
              placeholder="Select priority"
              dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
            >
              <Select.Item label="Low" value="Low" />
              <Select.Item label="Medium" value="Medium" />
              <Select.Item label="High" value="High" />
            </Select>
          </FormControl>

          <Button bgColor="primary.600" borderRadius={15}>
            Create
          </Button>
        </Flex>
      </Box>
    </Slide>
  );
};

export default NewProjectSlider;
