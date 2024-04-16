import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import { TextProps } from "../../../shared/CustomStylings";

const PostTypeOptions = ({
  publicToggleHandler,
  formik,
  announcementToggleHandler,
  isAnnouncementSelected,
  dateShown,
  endDateAnnouncementHandler,
  reference,
}) => {
  return (
    <ActionSheet ref={reference} onClose={() => reference.current?.hide()} size="full">
      <View style={styles.wrapper}>
        <View>
          <Text style={[{ fontSize: 16 }, TextProps]}>Choose Post Type</Text>
        </View>
        <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
          <TouchableOpacity onPress={publicToggleHandler} style={styles.container}>
            <View style={styles.content}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <MaterialIcons name="people" size={15} color="#3F434A" />
                <Text style={[{ fontSize: 12 }, TextProps]}>Public</Text>
              </View>
            </View>
            {formik.values.type === "Public" ? <MaterialCommunityIcons name="check" color="#3F434A" /> : ""}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              announcementToggleHandler();
            }}
            style={styles.container}
          >
            <View style={styles.content}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <MaterialCommunityIcons name="bullhorn" size={15} color="#3F434A" />
                <View>
                  <Text style={[{ fontSize: 12 }, TextProps]}>Announcement</Text>
                  {Platform.OS === "android" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>End Date must be provided</Text>
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
                  ) : (
                    <View
                      style={{
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>End Date must be provided</Text>
                      {isAnnouncementSelected && dateShown ? (
                        <CustomDateTimePicker
                          defaultValue={formik.values.end_date}
                          onChange={endDateAnnouncementHandler}
                          fontSize={12}
                          marginLeft={-15}
                        />
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            </View>
            {formik.values.type === "Announcement" ? (
              <MaterialCommunityIcons
                name="check"
                color="#3F434A"
                style={{ marginLeft: Platform.OS == "ios" ? -10 : null }}
              />
            ) : (
              ""
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
};

export default PostTypeOptions;

const styles = StyleSheet.create({
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
