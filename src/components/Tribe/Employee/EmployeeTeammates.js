import { Actionsheet, Flex, Text, VStack } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const EmployeeTeammates = ({ teammatesIsOpen, toggleTeammates, teammates }) => {
  return (
    <Actionsheet isOpen={teammatesIsOpen} onClose={toggleTeammates}>
      <Actionsheet.Content>
        <VStack w="95%">
          {teammates?.data.map((item, index) => {
            return (
              <Actionsheet.Item key={index} px={-1}>
                <Flex key={index} flexDir="row" alignItems="center" gap={3}>
                  <AvatarPlaceholder
                    image={item?.image}
                    name={item?.name}
                    size="md"
                    borderRadius="full"
                    isThumb={false}
                  />
                  <Flex>
                    <Text fontWeight={500} fontSize={14} color="#3F434A">
                      {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                    </Text>
                    <Text fontWeight={400} fontSize={12} color="#20A144">
                      {item?.position_name}
                    </Text>
                  </Flex>
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default EmployeeTeammates;
