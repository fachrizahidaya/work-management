import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import EmailButton from "../../shared/EmailButton";
import PhoneButton from "../../shared/PhoneButton";
import WhatsappButton from "../../shared/WhatsappButton";
import PersonalNestButton from "../../shared/PersonalNestButton";

const ContactList = ({
  id,
  name,
  position,
  image,
  phone,
  email,
  loggedEmployeeId,
  user,
  user_id,
  user_name,
  user_type,
  user_image,
  room_id,
  navigation,
  leave_status,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Employee Profile", {
          employeeId: id,
          returnPage: "Contact",
          loggedEmployeeId: loggedEmployeeId,
        })
      }
      style={{ ...card.card, flexDirection: "column", marginVertical: 5 }}
    >
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AvatarPlaceholder image={image} name={name} size="lg" isThumb={false} />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#3F434A",
                  width: 110,
                  overflow: "hidden",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
              {leave_status ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 10,
                    padding: 3,
                  }}
                >
                  On Leave
                </Text>
              ) : null}
            </View>

            <Text style={{ fontSize: 12, fontWeight: "400", color: "#20A144" }}>{position}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <WhatsappButton phone={phone} size={20} />
          <EmailButton email={email} size={20} />
          <PhoneButton phone={phone} size={20} />
          {user && (
            <PersonalNestButton
              email={email}
              user_id={user_id}
              user_name={user_name}
              user_type={user_type}
              user_image={user_image}
              room_id={room_id}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
  },
});
