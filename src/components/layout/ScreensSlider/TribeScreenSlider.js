import { useNavigation } from "@react-navigation/native";

import { Box, FlatList, Flex, Icon, Slide, Pressable, Text, Actionsheet } from "native-base";
import { Dimensions } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TribeScreenSlider = ({ isOpen, toggle }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");

  const items = [
    { icons: "rss", title: "Feed", screen: "Feed" },
    { icons: "account-outline", title: "My Information", screen: "My Information" },
    { icons: "clipboard-text-clock-outline", title: "Attendance History", screen: "Attendance History" },
    { icons: "car-outline", title: "Leave Request", screen: "Leave Request" },
    // { icons: "file-edit-outline", title: "Reimbursement", screen: "Reimbursement" },
    // { icons: "signal-cellular-3", title: "My KPI", screen: "My KPI" },
    { icons: "file-document-outline", title: "My Payslip", screen: "My Payslip" },
    { icons: "calendar-clock", title: "Calendar", screen: "Calendar" },
    { icons: "phone", title: "Contact", screen: "Contact" },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {items.map((item, idx) => {
          return (
            <Actionsheet.Item
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              onPress={() => {
                navigation.navigate(item.screen);
                toggle();
              }}
            >
              <Flex flexDir="row" alignItems="center" width="100%" gap={21}>
                <Box
                  bg="#f7f7f7"
                  borderRadius={5}
                  style={{ height: 32, width: 32 }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                </Box>
                <Text key={item.title} fontWeight={700} color="black">
                  {item.title}
                </Text>
              </Flex>
            </Actionsheet.Item>
          );
        })}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default TribeScreenSlider;
