import { useState } from "react";
import { StyleSheet } from "react-native";
import { Actionsheet, Box, Flex, FormControl, Icon, Image, Pressable, Spinner, Text, TextArea } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import FormButton from "../../../shared/FormButton";

const NewFeedForm = ({
  formik,
  image,
  setImage,
  pickImageHandler,
  publicToggleHandler,
  postTypeIsOpen,
  postTypeIsClose,
  announcementToggleHandler,
  isAnnouncementSelected,
  dateShown,
  endDateAnnouncementHandler,
  loggedEmployeeDivision,
  refetch,
}) => {
  const [isLoading, setIsLoading] = useState();
  return (
    <Flex borderWidth={1} borderRadius={10} borderColor="#dfdfdf" mt={3}>
      <FormControl isInvalid={formik.errors.content}>
        <TextArea
          minH={100}
          maxH={500}
          variant="unstyled"
          placeholder="What is happening?"
          multiline
          onChangeText={(value) => formik.setFieldValue("content", value)}
          value={formik.values.content}
          fontSize="lg"
        />

        <Flex p={2} flexDir="column" justifyContent="space-between">
          {image ? (
            image.size >= 1000000 ? (
              <Text textAlign="center">Image size is too large!</Text>
            ) : (
              <Box alignSelf="center">
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 300, height: 250, borderRadius: 15 }}
                  alt="image selected"
                />
                <Box
                  backgroundColor="#4b4f53"
                  borderRadius="full"
                  width={8}
                  height={8}
                  top={1}
                  padding={1.5}
                  right={1}
                  position="absolute"
                >
                  <Pressable onPress={() => setImage(null)}>
                    <Icon as={<MaterialCommunityIcons name="close" />} size={5} color="#FFFFFF" />
                  </Pressable>
                </Box>
              </Box>
            )
          ) : null}
        </Flex>

        <Actionsheet isOpen={postTypeIsOpen} onClose={postTypeIsClose} size="full">
          <Actionsheet.Content>
            <Flex w="100%" h={30} px={4} flexDir="row">
              <Text>Choose Post Type</Text>
            </Flex>
            <Actionsheet.Item
              onPress={publicToggleHandler}
              startIcon={<Icon as={<MaterialIcons name="people" />} size={6} />}
            >
              <Flex flex={1} w="70.6%" alignItems="center" justifyContent="space-between" flexDir="row">
                Public
                {formik.values.type === "Public" ? <Icon as={<MaterialCommunityIcons name="check" />} /> : ""}
              </Flex>
            </Actionsheet.Item>
            {loggedEmployeeDivision === 1 ||
              (loggedEmployeeDivision === 6 && (
                <Actionsheet.Item
                  onPress={() => {
                    announcementToggleHandler();
                  }}
                  startIcon={<Icon as={<MaterialCommunityIcons name="bullhorn" />} size={6} />}
                >
                  <Flex flex={1} w="85%" alignItems="center" justifyContent="space-between" flexDir="row">
                    <Box>
                      <Text>Announcement</Text>
                      <Flex gap={2} alignItems="center" flexDir="row">
                        <Text fontSize={12} fontWeight={400}>
                          End Date must be provided
                        </Text>
                        {isAnnouncementSelected && dateShown ? (
                          <CustomDateTimePicker
                            defaultValue={formik.values.end_date}
                            onChange={endDateAnnouncementHandler}
                            withText={true}
                            textLabel="Adjust date"
                            fontSize={12}
                          />
                        ) : null}
                      </Flex>
                    </Box>
                    {formik.values.type === "Announcement" ? <Icon as={<MaterialCommunityIcons name="check" />} /> : ""}
                  </Flex>
                </Actionsheet.Item>
              ))}
          </Actionsheet.Content>
        </Actionsheet>
      </FormControl>
      <Flex mt={2} py={3} px={2} flexDir="row" justifyContent="space-between" alignItems="center">
        <Pressable onPress={pickImageHandler}>
          <Icon
            as={<MaterialCommunityIcons name="attachment" />}
            size={25}
            color="#377893"
            style={{ transform: [{ rotate: "-35deg" }] }}
          />
        </Pressable>

        <Pressable
          borderRadius="full"
          borderWidth={1}
          borderColor="#FFFFFF"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#377893"
          width={50}
          height={50}
          opacity={formik.values.content === "" ? 0.5 : 1}
          onPress={() => {
            formik.handleSubmit();
            refetch();
          }}
        >
          <Icon
            as={<MaterialCommunityIcons name={formik.values.type === "Public" ? "send" : "bullhorn-variant"} />}
            size={25}
            color="#FFFFFF"
            style={{ transform: [{ rotate: "-45deg" }] }}
          />
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default NewFeedForm;
