import React from "react";
import { Dimensions, Platform } from "react-native";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Select, Button } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import CustomSelect from "../../../shared/CustomSelect";

const NewNoteSlider = ({ isOpen, setIsOpen }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Note
          </Text>
        </Flex>

        <Flex gap={17} mt={22}>
          <FormControl
          // isInvalid={formik.errors.email}
          >
            <FormControl.Label>Title</FormControl.Label>
            <Input
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              // onChangeText={(value) => formik.setFieldValue("email", value)}
              placeholder="The title of a note"
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
              h={200}
              // onChangeText={(value) => formik.setFieldValue("email", value)}
              placeholder="Create a mobile application on iOS and Android devices."
            />
            {/* <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage> */}
          </FormControl>

          <Button bgColor="primary.600" borderRadius={15}>
            Create
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewNoteSlider;
