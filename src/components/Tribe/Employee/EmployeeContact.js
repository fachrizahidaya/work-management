import { StyleSheet, View } from "react-native";

import WhatsappButton from "../../shared/WhatsappButton";
import EmailButton from "../../shared/EmailButton";
import PersonalNestButton from "../../shared/PersonalNestButton";

const EmployeeContact = ({ employee }) => {
  /**
   * Contacts handler
   */
  const contacts = [
    {
      id: 1,
      component: <WhatsappButton phone={employee?.data?.phone_number} size={20} />,
    },
    {
      id: 2,
      component: <EmailButton email={employee?.data?.email} size={20} />,
    },
    {
      id: 3,
      component: (
        <PersonalNestButton
          height={25}
          width={25}
          email={employee?.data?.email}
          user_id={employee?.data?.user?.id}
          room_id={employee?.data?.user?.id}
          user_name={employee?.data?.user?.name}
          user_type={employee?.data?.user?.user_type}
          user_image={employee?.data?.user?.image}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {contacts.map((contact) => {
        return (
          <View key={contact.id} style={styles.content}>
            {contact.component}
          </View>
        );
      })}
    </View>
  );
};

export default EmployeeContact;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 2,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  content: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dae2e6",
  },
});
