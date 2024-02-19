import { TouchableOpacity, Text, View, StyleSheet, Platform } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
          <View>

          <AvatarPlaceholder image={image} name={name} size="lg" isThumb={false} />
          {
            leave_status ?
          <View
            style={styles.editPicture}
           
          >
            <MaterialCommunityIcons name="airplane" size={15} color="#3F434A" />
          </View> : null
          }
          </View>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#3F434A",
                  width: Platform.OS === 'android' ? 160 : 150,
                  overflow: "hidden",
                 
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
              {/* {
            leave_status ?
          <View
            style={styles.editPicture}
           
          >
            <MaterialCommunityIcons name="airplane" size={15} color="#3F434A" />
          </View> : null
          } */}
            </View>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#20A144",
                width: 140,
                overflow: "hidden",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {position}
            </Text>
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
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    
    width: 20,
    height: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    shadowOffset: 0,
  },
});
