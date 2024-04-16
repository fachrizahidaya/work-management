import { Text, View } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const NewCustomerSubmission = ({ formik }) => {
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
          <Text style={[TextProps]}>ZIP Code: {formik.values.zip_code}</Text>
        </View>
      </View>
    </>
  );
};

export default NewCustomerSubmission;
