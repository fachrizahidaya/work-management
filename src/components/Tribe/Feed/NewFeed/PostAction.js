import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ActionSheet from "react-native-actions-sheet";

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
  reference,
}) => {
  return (
    <ActionSheet ref={reference} onClose={postTypeIsClose} size="full">
      <View style={styles.wrapper}>
        <View style={styles.title}>
          <Text>Choose Post Type</Text>
        </View>

        <TouchableOpacity
          onPress={publicToggleHandler}
          style={{ ...styles.wrapper, borderBottomWidth: 1, borderColor: "#E8E9EB" }}
        >
          <View
            style={{
              width: formik.values.type === "Public" ? "70.6%" : null,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="people" size={6} />
            <Text>Public</Text>
            {formik.values.type === "Public" ? <MaterialCommunityIcons name="check" /> : ""}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            announcementToggleHandler();
          }}
          style={{ ...styles.wrapper, borderBottomWidth: 1, borderColor: "#E8E9EB" }}
        >
          <View
            style={{
              width: formik.values.type === "Announcement" ? "85%" : null,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="bullhorn" size={6} />
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
            {formik.values.type === "Announcement" ? <MaterialCommunityIcons name="check" /> : ""}
          </View>
        </TouchableOpacity>
      </View>
    </ActionSheet>
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
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
