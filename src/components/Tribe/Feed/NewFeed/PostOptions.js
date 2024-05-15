import dayjs from "dayjs";

import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import Button from "../../../shared/Forms/Button";
import { TextProps } from "../../../shared/CustomStylings";

const PostOptions = ({ formik, loggedEmployeeImage, loggedEmployeeName, checkAccess, reference }) => {
  return (
    <View
      style={{
        ...styles.inputHeader,
        alignItems: formik.values.type === "Public" ? "center" : "center",
      }}
    >
      <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="lg" isThumb={false} />
      <View style={{ gap: 5 }}>
        <Button
          disabled={checkAccess ? false : true}
          padding={8}
          height={32}
          backgroundColor="#FFFFFF"
          onPress={() => (checkAccess ? reference.current?.show() : null)}
          borderRadius={15}
          variant="outline"
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[{ fontSize: 10 }, TextProps]}>{formik.values.type}</Text>
            {checkAccess ? <MaterialCommunityIcons name="chevron-down" color="#3F434A" /> : null}
          </View>
        </Button>
        {formik.values.type === "Public" ? (
          ""
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <MaterialCommunityIcons name="clock-time-three-outline" color="#3F434A" />
            <Text style={[{ fontSize: 12 }, TextProps]}>
              {!formik.values.end_date ? "Please select" : dayjs(formik.values.end_date).format("YYYY-MM-DD")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PostOptions;

const styles = StyleSheet.create({
  inputHeader: {
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 2,
    marginTop: 22,
  },
});
