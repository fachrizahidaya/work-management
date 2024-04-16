import { Text, View } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const NewSupplierSubmission = ({ formik }) => {
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
    {
      title: "Bank Account",
      value: formik.values.bank_account,
    },
    {
      title: "Account Number",
      value: formik.values.account_no,
    },
    {
      title: "Account Name",
      value: formik.values.account_name,
    },
  ];

  const addressArr = [
    {
      title: "City",
      value: formik.values.city,
    },
    {
      title: "Region",
      value: formik.values.region,
    },
    {
      title: "City",
      value: formik.values.city,
    },
  ];

  return (
    <>
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
    </>
  );
};

export default NewSupplierSubmission;
