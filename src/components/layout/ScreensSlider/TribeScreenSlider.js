import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Box, FlatList, Flex, Icon, Slide, Pressable, Text, Actionsheet } from "native-base";
import { Dimensions } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useGetSubMenu } from "../../../hooks/useGetSubMenu";

const TribeScreenSlider = ({ isOpen, toggle }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");
  const menuSelector = useSelector((state) => state.user_menu);
  const { mergedMenu } = useGetSubMenu(menuSelector.user_menu);
  const excludeSubscreen = [
    "Divisions",
    "Job Positions",
    "Employees",
    "Leave Types",
    "Holidays",
    "Time Groups",
    "Leave Quota",
    "Attendance History",
    "Leave History",
    "Payroll Groups",
    "Payroll Components",
    "Upload Payslip",
  ];
  const filteredMenu = mergedMenu.filter((item) => !excludeSubscreen.includes(item.name));

  const items = [
    { icons: "rss", title: "Feed", screen: "Feed" },
    { icons: "account-outline", title: "My Information", screen: "My Information" },
    { icons: "clipboard-text-clock-outline", title: "Attendance", screen: "Attendance" },
    { icons: "car-outline", title: "Leave Request", screen: "Leave Request" },
    { icons: "file-edit-outline", title: "Reimbursement", screen: "Reimbursement" },
    // { icons: "signal-cellular-3", title: "My KPI", screen: "My KPI" },
    { icons: "file-document-outline", title: "My Payslip", screen: "My Payslip" },
    { icons: "calendar-clock", title: "Calendar", screen: "Calendar" },
    { icons: "phone", title: "Contact", screen: "Contact" },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {filteredMenu.map((item, idx) => {
          return (
            <Actionsheet.Item
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              onPress={() => {
                navigation.navigate(item.name);
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
                  <Icon as={<MaterialCommunityIcons name={item.icon} />} size={6} color="#2A7290" />
                </Box>
                <Text key={item.name} fontWeight={700} color="black">
                  {item.name}
                </Text>
              </Flex>
            </Actionsheet.Item>
          );
        })}
        {/* <Actionsheet.Item
          borderColor="#E8E9EB"
          borderBottomWidth={1}
          onPress={() => {
            navigation.navigate("Reimbursement");
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
              <Icon as={<MaterialCommunityIcons name="file-edit-outline" />} size={6} color="#2A7290" />
            </Box>
            <Text fontWeight={700} color="black">
              Reimbursement
            </Text>
          </Flex>
        </Actionsheet.Item> */}
        <Actionsheet.Item
          borderColor="#E8E9EB"
          borderBottomWidth={1}
          onPress={() => {
            navigation.navigate("My Information");
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
              <Icon as={<MaterialCommunityIcons name="account-outline" />} size={6} color="#2A7290" />
            </Box>
            <Text fontWeight={700} color="black">
              My Information
            </Text>
          </Flex>
        </Actionsheet.Item>
        <Actionsheet.Item
          borderColor="#E8E9EB"
          borderBottomWidth={1}
          onPress={() => {
            navigation.navigate("Calendar");
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
              <Icon as={<MaterialCommunityIcons name="calendar-clock" />} size={6} color="#2A7290" />
            </Box>
            <Text fontWeight={700} color="black">
              Calendar
            </Text>
          </Flex>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default TribeScreenSlider;
