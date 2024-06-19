import { Dimensions, Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";

import LateOrEarly from "../Attendance/FormType/LateOrEarly";

const ReasonModal = ({ isOpen, toggle, formik, types, timeIn, late, timeDuty }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={toggle}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      backdropColor="#272A2B"
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      hideModalContentWhileAnimating={true}
      useNativeDriver={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <LateOrEarly
            formik={formik}
            titleTime="Clock-in Time"
            arrayList={types}
            time={timeIn}
            title="Late Type"
            inputValue={formik.values.late_reason}
            inputOnChangeText={(value) => formik.setFieldValue("late_reason", value)}
            selectOnValueChange={(value) => formik.setFieldValue("late_type", value)}
            titleDuty="On Duty"
            timeDuty={timeDuty}
            timeLateOrEarly={late}
            placeholder="Select Late Type"
            fieldOption="late_type"
            inputType={formik.values.late_type}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReasonModal;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
  },
});
