import React from "react";
import { Actionsheet, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";

const PostAction = ({
  postTypeIsOpen,
  postTypeIsClose,
  publicToggleHandler,
  formik,
  loggedEmployeeDivision,
  announcementToggleHandler,
  isAnnouncementSelected,
  dateShown,
  endDateAnnouncementHandler,
}) => {
  return (
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
        {/* {loggedEmployeeDivision === 1 ||
          (loggedEmployeeDivision === 6 && ( */}
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
        {/* ))} */}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PostAction;
