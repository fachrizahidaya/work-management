import dayjs from "dayjs";

import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";

const MyTeamLeaveRequestItem = ({
  id,
  employee_image,
  employee_name,
  leave_name,
  days,
  begin_date,
  end_date,
  handleResponse,
  item,
  status,
}) => {
  const approvalHandler = async (response) => {
    await SheetManager.hide("form-sheet");
    handleResponse(response, item);
  };

  const renderApprovalOptions = () => (
    <View style={styles.approvalOption}>
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => approvalHandler("Approved")}
          style={{
            ...styles.containerApproval,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#FFFFFF",
          }}
        >
          <Text style={[TextProps, { fontSize: 16, fontWeight: "400" }]}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => approvalHandler("Rejected")}
          style={{
            ...styles.containerApproval,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#FFFFFF",
          }}
        >
          <Text style={[TextProps, { fontSize: 16, fontWeight: "400" }]}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View key={id} style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
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
                  children: renderApprovalOptions(),
                },
              })
            }
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" style={{ borderRadius: 20 }} />
          </Pressable>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#595F69" }}>{item?.reason}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.leaveTime}>
          <MaterialCommunityIcons name="calendar-month" size={20} color="#3F434A" />
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>
            {dayjs(begin_date).format("DD MMM YYYY")} - {dayjs(end_date).format("DD MMM YYYY")} • {days}{" "}
            {days < 2 ? "day" : "days"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MyTeamLeaveRequestItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    gap: 10,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginVertical: 4,
    marginHorizontal: 14,
  },
  containerApproval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
  approvalOption: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  leaveTime: {
    flexDirection: "row",
    gap: 5,
    padding: 5,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
  },
});
