import { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { Linking, SafeAreaView, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { Actionsheet, Avatar, Badge, Box, Button, Flex, Icon, Image, Pressable, Text, View } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import FeedCard from "../../../components/Tribe/Feed/FeedCard";
import FeedCardItem from "../../../components/Tribe/Feed/FeedCardItem";
import { CopyToClipboard } from "../../../components/shared/CopyToClipboard";

const EmployeeProfileScreen = ({ route }) => {
  const [index, setIndex] = useState(0);
  const [tabValue, setTabValue] = useState("posts");

  const navigation = useNavigation();
  const { employeeId } = route.params;
  const router = useRoute();
  const tabs = [{ title: "posts" }];

  const {
    data: employee,
    isFetching: employeeIsFetching,
    refetch: refetchEmployee,
  } = useFetch(`/hr/employees/${router.params.employeeId}`);

  const {
    data: teammates,
    refetch: refetchTeammates,
    isFetching: teammatesIsFetching,
  } = useFetch(`/hr/employees/${router.params.employeeId}/team`);

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedsIsFetching,
  } = useFetch(`/hr/posts/personal/${employee?.data?.id}`);

  const onChangeTab = (value) => {
    setTabValue(value);
  };

  const handleCallPress = () => {
    try {
      const phoneUrl = `tel:0${employee?.data?.phone_number}`;
      Linking.openURL(phoneUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailPress = () => {
    try {
      const emailUrl = `mailto:${employee?.data?.email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleWhatsappPress = () => {
    try {
      const whatsappUrl = `whatsapp://send?phone=+62${employee?.data?.phone_number}`;
      Linking.openURL(whatsappUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Flex
          borderBottomColor="#E8E9EB"
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          bgColor="#FFFFFF"
          py={14}
          px={15}
        >
          <PageHeader
            title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
            onPress={() => navigation.navigate("Feed")}
          />
        </Flex>

        <Box>
          <Image
            source={require("../../../assets/profile_banner.jpg")}
            alignSelf="center"
            h={200}
            w={500}
            alt="empty"
            resizeMode="cover"
            position="relative"
          />
          <Flex flex={1} gap={5}>
            <Flex px={3} position="relative" flexDir="column" bgColor="#FFFFFF">
              <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
                <Pressable
                  padding={1}
                  borderRadius="full"
                  borderWidth={1}
                  borderColor="#dae2e6"
                  onPress={handleWhatsappPress}
                >
                  <Icon as={<MaterialCommunityIcons name="whatsapp" />} size={6} />
                </Pressable>
                <Pressable
                  padding={1}
                  borderRadius="full"
                  borderWidth={1}
                  borderColor="#dae2e6"
                  onPress={handleEmailPress}
                >
                  <Icon as={<MaterialCommunityIcons name="email-outline" />} size={6} />
                </Pressable>

                <Pressable
                  padding={1}
                  borderRadius="full"
                  borderWidth={1}
                  borderColor="#dae2e6"
                  onPress={() => navigation.navigate("Chat List")}
                >
                  <Image
                    source={require("../../../assets/icons/nest_logo.png")}
                    alt="nest"
                    style={{ height: 25, width: 25 }}
                  />
                </Pressable>
              </Flex>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${employee?.data?.image}` }}
                resizeMethod="contain"
                borderRadius="full"
                w={100}
                h={100}
                alt="profile image"
                borderWidth={2}
                borderColor="#FFFFFF"
                position="relative"
                bottom="90px"
              />

              <Flex mt="-80px">
                <Flex gap={3}>
                  <Box>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Text fontWeight={500} fontSize={20} color="#3F434A">
                        {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
                      </Text>
                      <Text fontWeight={400} fontSize={14} color="#8A9099">
                        {`(${employee?.data?.gender.charAt(0).toUpperCase() + employee?.data?.gender.slice(1)})`}
                      </Text>
                    </Flex>
                    {/* <Text fontWeight={400} fontSize={14} color="#8A9099">
                      {employee?.data?.division_name}
                    </Text> */}
                    <Text fontWeight={400} fontSize={14} color="#8A9099">
                      {employee?.data?.position_name}
                    </Text>
                  </Box>
                  <Box>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={3} color="#3F434A" />
                      <TouchableOpacity onPress={() => CopyToClipboard(employee?.data?.phone_number)}>
                        <Text fontWeight={400} fontSize={12} color="#8A9099">
                          {employee?.data?.phone_number}
                        </Text>
                      </TouchableOpacity>
                    </Flex>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Icon as={<MaterialCommunityIcons name="cake-variant-outline" />} size={3} color="#3F434A" />
                      <Text fontWeight={400} fontSize={12} color="#8A9099">
                        {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
                      </Text>
                    </Flex>
                  </Box>
                  <Flex gap={1} alignItems="center" flexDir="row">
                    <Text>{teammates?.data.length}</Text>
                    <Text fontWeight={400} fontSize={12} color="#8A9099">
                      Teammates
                    </Text>
                    <Actionsheet>
                      <Actionsheet.Content></Actionsheet.Content>
                    </Actionsheet>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex px={3} minHeight={2} flex={1} flexDir="column" gap={2}>
              <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

              {
                tabValue === "posts" ? (
                  <FlashList
                    data={feeds?.data}
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={100}
                    renderItem={({ item }) => (
                      <FeedCardItem
                        key={item?.id}
                        id={item?.id}
                        employeeId={item?.author_id}
                        employeeName={item?.employee_name}
                        createdAt={item?.created_at}
                        employeeImage={item?.employee_image}
                        content={item?.content}
                        total_like={item?.total_like}
                        totalComment={item?.total_comment}
                        likedBy={item?.liked_by}
                        attachment={item?.file_path}
                        type={item?.type}
                      />
                    )}
                  />
                ) : null
                // <Flex minHeight={2} flex={1} px={3} gap={2} flexDir="column">
                //   <FlashList
                //     data={teammates?.data}
                //     keyExtractor={(item, index) => index}
                //     onEndReachedThreshold={0.1}
                //     estimatedItemSize={50}
                //     renderItem={({ item }) => (
                //       <Flex flexDirection="column" my={2}>
                //         <Flex flexDir="row" alignItems="center" gap={3}>
                //           <AvatarPlaceholder image={item?.image} name={item?.name} size="md" borderRadius="full" />
                //           <Flex>
                //             <Text fontWeight={500} fontSize={14} color="#3F434A">
                //               {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                //             </Text>
                //             <Text fontWeight={400} fontSize={12} color="#20A144">
                //               {item?.position_name}
                //             </Text>
                //           </Flex>
                //         </Flex>
                //       </Flex>
                //     )}
                //   />
                // </Flex>
              }
            </Flex>
          </Flex>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
