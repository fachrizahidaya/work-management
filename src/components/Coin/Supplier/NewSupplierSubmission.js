import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

import { TextProps } from "../../shared/CustomStylings";
import Button from "../../shared/Forms/Button";
import { useFetch } from "../../../hooks/useFetch";

const NewSupplierSubmission = ({
  formik,
  bankFormik,
  visible,
  backdropPress,
  isSubmitting,
  onSubmit,
  toggleOtherModal,
  color = null,
}) => {
  const { data: selectedBank } = useFetch(bankFormik.values.bank_id && `/acc/bank/${bankFormik.values.bank_id}`);

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const profileArr = [
    {
      title: "Name",
      value: formik.values.name,
    },
    {
      title: "Email",
      value: formik.values.email,
    },
    {
      title: "Phone Number",
      value: formik.values.phone,
    },
  ];

  const addressArr = [
    {
      title: "City",
      value: formik.values.city,
    },
    {
      title: "Province",
      value: formik.values.province,
    },
    {
      title: "State",
      value: formik.values.state,
    },
  ];

  const bankArr = [
    {
      title: "Bank",
      value: selectedBank?.data?.name,
    },
    {
      title: "Account Number",
      value: bankFormik.values.account_no,
    },
    {
      title: "Account Name",
      value: bankFormik.values.account_name,
    },
  ];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={backdropPress}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      hideModalContentWhileAnimating={true}
      useNativeDriver={false}
      onModalHide={() => {
        toggleOtherModal();
      }}
    >
      <View style={styles.container}>
        <View style={{ gap: 5 }}>
          <Text style={[TextProps]}>Profile Details</Text>
          <View style={{ marginTop: 10, gap: 5 }}>
            {profileArr.map((item, index) => {
              return (
                <Text style={[TextProps]} key={index}>
                  {item.title}: {item.value}
                </Text>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={[TextProps]}>Address Details</Text>
          <View style={{ marginTop: 10, gap: 5 }}>
            <Text style={[TextProps]}>Address Line:</Text>
            <Text style={[TextProps]}>{formik.values.address}</Text>
            {addressArr.map((item, index) => {
              return (
                <Text style={[TextProps]} key={index}>
                  {item.title}: {item.value}
                </Text>
              );
            })}
          </View>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={[TextProps]}>Bank Details</Text>
          <View style={{ marginTop: 10, gap: 5 }}>
            {bankArr.map((item, index) => {
              return (
                <Text style={[TextProps]} key={index}>
                  {item.title}: {item.value}
                </Text>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Button
            disabled={isSubmitting}
            onPress={() => {
              !isSubmitting && backdropPress();
            }}
            flex={1}
            variant="outline"
            backgroundColor="#FD7972"
          >
            <Text style={{ color: "#FD7972" }}>Cancel</Text>
          </Button>

          <Button
            bgColor={isSubmitting ? "coolGray.500" : color ? color : "red.600"}
            onPress={onSubmit}
            startIcon={isSubmitting && <ActivityIndicator />}
            flex={1}
          >
            <Text style={{ color: "#FFFFFF" }}>Confirm</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default NewSupplierSubmission;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
});
