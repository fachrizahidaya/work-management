import dayjs from "dayjs";

import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";
import { TextProps } from "../../../shared/CustomStylings";
import { SheetManager } from "react-native-actions-sheet";

const MyTeamLeaveRequestItem = ({
  id,
  employee_image,
  employee_name,
  leave_name,
  days,
  begin_date,
  end_date,
  responseHandler,
  isSubmitting,
  formik,
  item,
  status,
}) => {
  return (
    <View
      key={id}
      style={{
        backgroundColor: "#ffffff",
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 15,
        flexDirection: "column",
        marginVertical: 5,
        gap: 10,
        elevation: 3,
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: 4,
        marginBottom: 4,
        marginHorizontal: 2,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AvatarPlaceholder image={employee_image} name={employee_name} size="lg" isThumb={false} />
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#3F434A" }}>{employee_name}</Text>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#377893" }}>{leave_name}</Text>
          </View>
        </View>
        {status === "Pending" ? (
          <Pressable
            style={{ marginRight: 1 }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View
                      style={{
                        display: "flex",
                        gap: 21,
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        paddingBottom: -20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={async () => {
                          await SheetManager.hide("form-sheet");
                          responseHandler("Approved", item);
                        }}
                      >
                        <Text style={[{ fontSize: 14, fontWeight: "400" }, TextProps]}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          await SheetManager.hide("form-sheet");
                          responseHandler("Rejected", item);
                        }}
                      >
                        <Text style={[{ fontSize: 14, fontWeight: "400", color: "#D64B4B" }]}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                },
              })
            }
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" style={{ borderRadius: 20 }} />
          </Pressable>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#595F69" }}>{item?.reason}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            padding: 5,
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: "#F8F8F8",
          }}
        >
          <MaterialCommunityIcons name="calendar-month" size={20} color="#3F434A" />
          {/* <Text style={[{ fontSize: 12 }, TextProps]}>{days > 1 ? `${days} days` : `${days} day`}</Text> */}
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>
            {dayjs(begin_date).format("DD MMM YYYY")} - {dayjs(end_date).format("DD MMM YYYY")} • {days}{" "}
            {days < 2 ? "day" : "days"}
          </Text>
        </View>
        {/* {status === "Pending" ? (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <FormButton
              onPress={() => responseHandler("Rejected", item)}
              isSubmitting={isSubmitting === "Rejected" ? formik.isSubmitting : null}
              size="xs"
              backgroundColor="#FF6262"
              fontColor="white"
              padding={5}
              height={35}
            >
              <Text style={[{ fontSize: 12, color: "#FFFFFF" }]}>Decline</Text>
            </FormButton>
            <FormButton
              onPress={() => responseHandler("Approved", item)}
              isSubmitting={isSubmitting === "Approved" ? formik.isSubmitting : null}
              size="xs"
              backgroundColor="#377893"
              fontColor="white"
              padding={5}
              height={35}
            >
              <Text style={[{ fontSize: 12, color: "#FFFFFF" }]}>Approve</Text>
            </FormButton>
          </View>
        ) : (
          <Text style={{ color: status === "Pending" ? "#F0C290" : status === "Approved" ? "#377893" : "#FF6262" }}>
            {item?.status}
          </Text>
        )} */}
      </View>
    </View>
  );
};

export default MyTeamLeaveRequestItem;

const styles = StyleSheet.create({
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
