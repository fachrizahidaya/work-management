import {Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Select, Button } from "native-base";
import { Dimensions, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const NewFeedSlider = ({ isOpen, setIsOpen }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Box w={width} h={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Post
          </Text>
        </Flex>
        <Flex gap={17} mt={22}>
          <FormControl
          // isInvalid={formik.errors.email}
          >
            <FormControl.Label>Description</FormControl.Label>
            <Input
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              multiline
              minH={200}
              maxH={400}
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
    </Slide>
  );
};

export default NewFeedSlider;
