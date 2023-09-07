import { useNavigation } from "@react-navigation/native";
import { Box, FlatList, Flex, Icon, Slide, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const TribeScreenSlider = ({ isOpen, setIsOpen }) => {
  const navigation = useNavigation();

  const items = [
    { icons: "sticker-text-outline", title: "Feed", screen: "Feed" },
    { icons: "clipboard-text-clock-outline", title: "Attendance Log", screen: "" },
    { icons: "exit-run", title: "Leave Request", screen: "" },
    { icons: "file-edit-outline", title: "Reimbursement", screen: "" },
    { icons: "signal-cellular-3", title: "My KPI", screen: "" },
    { icons: "file-document-outline", title: "My Payslip", screen: "" },
    { icons: "calendar-clock", title: "Calendar", screen: "" },
    { icons: "phone", title: "Contact", screen: "" },
  ];

  return (
    <Slide in={isOpen} placement="bottom" duration={200}>
      <Box
        position="absolute"
        bottom={95} // Adjust this value to position the slide component
        width="100%"
        bgColor="white"
      >
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate(item.screen);
                setIsOpen(!isOpen);
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
    </Slide>
  );
};

export default TribeScreenSlider;
