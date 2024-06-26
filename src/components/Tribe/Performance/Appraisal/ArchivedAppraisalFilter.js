import { Pressable, StyleSheet, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";

const ArchivedAppraisalFilter = ({ startDate, startDateChangeHandler, endDate, endDateChangeHandler }) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        SheetManager.show("form-sheet", {
          payload: {
            children: (
              <View style={styles.wrapper}>
                <View style={{ gap: 5 }}>
                  <CustomDateTimePicker
                    unlimitStartDate={true}
                    width="100%"
                    defaultValue={startDate ? startDate : null}
                    onChange={startDateChangeHandler}
                    title="Begin Date"
                  />
                </View>
                <View style={{ gap: 5 }}>
                  <CustomDateTimePicker
                    unlimitStartDate={true}
                    width="100%"
                    defaultValue={endDate ? endDate : null}
                    onChange={endDateChangeHandler}
                    title="End Date"
                  />
                </View>
              </View>
            ),
          },
        })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
      </View>
    </Pressable>
  );
};

export default ArchivedAppraisalFilter;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E8E9EB",
    backgroundColor: "#FFFFFF",
  },
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
});
