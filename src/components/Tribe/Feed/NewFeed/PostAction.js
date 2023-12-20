import { Actionsheet, Icon } from "native-base";
import { View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";

const PostAction = ({
  postTypeIsOpen,
  postTypeIsClose,
  publicToggleHandler,
  formik,
  announcementToggleHandler,
  isAnnouncementSelected,
  dateShown,
  endDateAnnouncementHandler,
}) => {
  return (
    <Actionsheet isOpen={postTypeIsOpen} onClose={postTypeIsClose} size="full">
      <Actionsheet.Content>
        <View style={styles.title}>
          <Text>Choose Post Type</Text>
        </View>
        <Actionsheet.Item
          onPress={publicToggleHandler}
          startIcon={<Icon as={<MaterialIcons name="people" />} size={6} />}
        >
          <View style={{ ...styles.publicButton, width: formik.values.type === "Public" ? "70.6%" : null }}>
            <Text>Public</Text>
            {formik.values.type === "Public" ? <Icon as={<MaterialCommunityIcons name="check" />} /> : ""}
          </View>
        </Actionsheet.Item>

        <Actionsheet.Item
          onPress={() => {
            announcementToggleHandler();
          }}
          startIcon={<Icon as={<MaterialCommunityIcons name="bullhorn" />} size={6} />}
        >
          <View style={{ ...styles.announcementButton, width: formik.values.type === "Announcement" ? "85%" : null }}>
            <View>
              <Text>Announcement</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: 400 }}>End Date must be provided</Text>
                {isAnnouncementSelected && dateShown ? (
                  <CustomDateTimePicker
                    defaultValue={formik.values.end_date}
                    onChange={endDateAnnouncementHandler}
                    withText={true}
                    textLabel="Adjust date"
                    fontSize={12}
                  />
                ) : null}
              </View>
            </View>
            {formik.values.type === "Announcement" ? <Icon as={<MaterialCommunityIcons name="check" />} /> : ""}
          </View>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PostAction;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    width: "100%",
    height: 30,
    paddingHorizontal: 4,
  },
  publicButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  announcementButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
