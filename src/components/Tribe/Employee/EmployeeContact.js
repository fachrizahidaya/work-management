import { Box, Flex } from "native-base";
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
      component: <WhatsappButton phone={employee?.data?.phone_number} size={6} />,
    },
    {
      id: 2,
      component: <EmailButton email={employee?.data?.email} size={6} />,
    },
    {
      id: 3,
      component: <PersonalNestButton height={25} width={25} />,
    },
  ];

  return (
    <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
      {contacts.map((contact) => {
        return (
          <Box key={contact.id} padding={1} borderRadius="full" borderWidth={1} borderColor="#dae2e6">
            {contact.component}
          </Box>
        );
      })}
    </Flex>
  );
};

export default EmployeeContact;
