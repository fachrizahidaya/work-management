import { useNavigation } from "@react-navigation/native";

import { Box, FlatList, Flex, Icon, Slide, Pressable, Text } from "native-base";
import { Dimensions } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TribeScreenSlider = ({ toggle }) => {
  const navigation = useNavigation();
  const { height } = Dimensions.get("window");

  const items = [
    { icons: "sticker-text-outline", title: "Feed", screen: "Feed" },
    { icons: "account-outline", title: "My Information", screen: "My Information" },
    { icons: "clipboard-text-clock-outline", title: "Attendance Log", screen: "Attendance Log" },
    { icons: "car-outline", title: "Leave Request", screen: "Leave Request" },
    { icons: "file-edit-outline", title: "Reimbursement", screen: "" },
    { icons: "signal-cellular-3", title: "My KPI", screen: "" },
    { icons: "file-document-outline", title: "My Payslip", screen: "My Payslip" },
    { icons: "calendar-clock", title: "Calendar", screen: "Calendar" },
    { icons: "phone", title: "Contact", screen: "Contact" },
  ];

  return (
    <Box>
      <Pressable position="absolute" bottom={79} height={height} width="100%" zIndex={2} onPress={toggle}></Pressable>
      <Box
        position="absolute"
        bottom={79} // Adjust this value to position the slide component
        width="100%"
        bgColor="white"
        zIndex={3}
      >
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate(item.screen);
                toggle();
              }}
            >
              <Flex
                flexDir="row"
                alignItems="center"
                gap={25}
                px={8}
                py={4}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                borderTopWidth={item.icons === "home" ? 1 : 0}
              >
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
            </Pressable>
          )}
        />
      </Box>
    </Box>
  );
};

export default TribeScreenSlider;
