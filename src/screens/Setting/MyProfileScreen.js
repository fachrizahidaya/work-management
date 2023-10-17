import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  Box,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  TextArea,
  Text,
  Pressable,
  Icon,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import FormButton from "../../components/shared/FormButton";

const MyProfileScreen = ({ route }) => {
  const { profile } = route.params;
  const navigation = useNavigation();

  const phoneNumber = profile?.data?.phone_number.toString();

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Profile Screen" backButton={() => navigation.navigate("Setting")} />
      </Flex>
      <ScrollView>
        <Flex alignItems="center" justifyContent="center" my={3}>
          <Box borderStyle="dashed" borderColor="#C6C9CC" borderRadius={20} padding={2} borderWidth={1}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${profile?.data?.image}` }}
              resizeMethod="contain"
              borderRadius={20}
              w={120}
              h={120}
              alt="profile picture"
            />
            <Pressable style={styles.createIcon} shadow="0" borderRadius="full" borderWidth={1} borderColor="#C6C9CC">
              <Icon as={<MaterialCommunityIcons name="pencil-outline" />} size={5} color="#3F434A" />
            </Pressable>
          </Box>
        </Flex>
        <Flex my={3} gap={11} px={5}>
          <FormControl
          // isInvalid={formik.errors.reason}
          >
            <FormControl.Label>Name</FormControl.Label>
            <Input
              type="text"
              // value={formik.values.reason}
              // onChangeText={(value) => formik.setFieldValue("reason", value)}
              // placeholder="Input Title"
              defaultValue={profile?.data?.name.length > 30 ? profile?.data?.name.split(" ")[0] : profile?.data?.name}
            />
            {/* <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.email}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.username}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Phone Number</FormControl.Label>
            <Input
              InputLeftElement={
                <Flex ml={1}>
                  <Text>+62</Text>
                </Flex>
              }
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={phoneNumber}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Status</FormControl.Label>
            <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.status.charAt(0).toUpperCase() + profile?.data?.status.slice(1)}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Job Title</FormControl.Label>
            <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.position_name}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Address</FormControl.Label>
            <TextArea
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.address}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Date of Birth</FormControl.Label>
            <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.birthdate_convert}
            />
          </FormControl>

          <FormButton
          // isSubmitting={formik.isSubmitting}
          //  onPress={formik.handleSubmit}
          >
            <Text color="#FFFFFF">Save</Text>
          </FormButton>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  createIcon: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    right: 0,
    zIndex: 2,
  },
});
