import dayjs from "dayjs";

import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";

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
    <View key={id} style={{ ...card.card, flexDirection: "column", marginVertical: 5, gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, flexDirection: "row", gap: 5 }}>
          <AvatarPlaceholder
            image={employee_image}
            name={employee_name}
            size="xs"
            borderRadius="full"
            isThumb={false}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>{leave_name} | </Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#377893" }}>{employee_name}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>{item?.reason}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 5, padding: 5, borderRadius: 10, backgroundColor: "#F8F8F8" }}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#186688" />
          <Text>{days > 1 ? `${days} days` : `${days} day`}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>
          {dayjs(begin_date).format("DD.MM.YYYY")} - {dayjs(end_date).format("DD.MM.YYYY")} • {days}{" "}
          {days < 2 ? "day" : "days"}
        </Text>
        {status === "Pending" ? (
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
              <Text>Decline</Text>
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
              <Text>Approve</Text>
            </FormButton>
          </View>
        ) : (
          <Text style={{ color: "#FF6262" }}>{item?.status}</Text>
        )}
      </View>
    </View>
  );
};

export default MyTeamLeaveRequestItem;
