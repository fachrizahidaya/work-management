import { useNavigation } from "@react-navigation/native";

import { Flex, Icon, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Options = ({ profile }) => {
  const navigation = useNavigation();
  const titles = [
    {
      id: 1,
      name: "Name, Phone Numbers, Email, Username",
      navigate: () =>
        navigation.navigate("Profile Screen", {
          profile: profile,
        }),
    },
    {
      id: 2,
      name: "Company",
      navigate: () =>
        navigation.navigate("Company Screen", {
          profile: profile,
        }),
    },
    {
      id: 3,
      name: "Subscriptions",
      navigate: () =>
        navigation.navigate("Subscription Screen", {
          profile: profile,
        }),
    },
    {
      id: 4,
      name: "Payments",
      navigate: () =>
        navigation.navigate("Payment Screen", {
          profile: profile,
        }),
    },
  ];

  return (
    <Flex bgColor="#FAFAFA" borderRadius={9}>
      {titles.map((title) => {
        return (
          <Pressable
            key={title.id}
            display="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            h={42}
            p="8px 12px"
            onPress={title.navigate}
          >
            <Flex flexDir="row" alignItems="center" gap={4}>
              <Text fontSize={14} fontWeight={400}>
                {title.name}
              </Text>
            </Flex>

            <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
          </Pressable>
        );
      })}
    </Flex>
  );
};

export default Options;
