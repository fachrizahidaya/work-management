import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ActionSheet from "react-native-actions-sheet";

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
    <ActionSheet
      ref={reference}
      onClose={() => reference.current?.hide()}
      size="full"
    >
      <View
        style={{
          display: "flex",
          gap: 21,
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 40,
        }}
      >
        <View>
          <Text style={[{ fontSize: 16, fontWeight: "700" }]}>
            Choose Post Type
          </Text>
        </View>
        <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
          <TouchableOpacity
            onPress={publicToggleHandler}
            style={{
              ...styles.container,
              borderBottomWidth: 1,
              borderBottomColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <MaterialIcons name="people" size={15} color="#3F434A" />
                <Text style={[{ fontSize: 12 }, TextProps]}>Public</Text>
              </View>
            </View>
            {formik.values.type === "Public" ? (
              <MaterialCommunityIcons name="check" color="#3F434A" />
            ) : (
              ""
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              announcementToggleHandler();
            }}
            style={{
              ...styles.container,
              borderBottomWidth: 1,
              borderBottomColor: "#FFFFFF",
              height: null,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <MaterialCommunityIcons
                  name="bullhorn"
                  size={15}
                  color="#3F434A"
                />
                <View>
                  <Text style={[{ fontSize: 12 }, TextProps]}>
                    Announcement
                  </Text>
                  {Platform.OS === "android" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>
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
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        End Date must be provided
                      </Text>
                      {isAnnouncementSelected && dateShown ? (
                        <CustomDateTimePicker
                          defaultValue={formik.values.end_date}
                          onChange={endDateAnnouncementHandler}
                          // withText={true}
                          // textLabel="Adjust date"
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
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
