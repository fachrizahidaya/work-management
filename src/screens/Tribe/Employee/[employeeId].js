import { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { Avatar, Badge, Box, Button, Flex, Icon, Image, Text, View } from "native-base";
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

const EmployeeProfileScreen = ({ route }) => {
  const [index, setIndex] = useState(0);
  const [tabValue, setTabValue] = useState("posts");

  const navigation = useNavigation();
  const { employeeId } = route.params;
  const router = useRoute();
  const tabs = [{ title: "posts" }, { title: "teammates" }];

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
          <PageHeader title="" onPress={() => navigation.navigate("Feed")} />
          <Icon
            // onPress={() => CopyToClipboard(employee?.data?.email)}
            as={<MaterialCommunityIcons name="chat-processing-outline" />}
            size={5}
            color="#3F434A"
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
                bottom={12}
              />
              <Flex mt={-10}>
                <Flex gap={3}>
                  <Box>
                    <Text fontWeight={500} fontSize={20} color="#3F434A">
                      {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
                    </Text>
                    {/* <Text fontWeight={400} fontSize={14} color="#8A9099">
                      {employee?.data?.division_name}
                    </Text> */}
                    <Text fontWeight={400} fontSize={14} color="#8A9099">
                      {employee?.data?.position_name}
                    </Text>
                  </Box>
                  <Box>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Text fontWeight={400} fontSize={12} color="#8A9099">
                        {employee?.data?.email}
                      </Text>
                      <Icon
                        onPress={() => CopyToClipboard(employee?.data?.email)}
                        as={<MaterialCommunityIcons name="content-copy" />}
                        size={3}
                        color="#3F434A"
                      />
                    </Flex>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Text fontWeight={400} fontSize={12} color="#8A9099">
                        {employee?.data?.phone_number}
                      </Text>
                      <Icon
                        onPress={() => CopyToClipboard(employee?.data?.phone_number)}
                        as={<MaterialCommunityIcons name="content-copy" />}
                        size={3}
                        color="#3F434A"
                      />
                    </Flex>
                    <Text fontWeight={400} fontSize={12} color="#8A9099">
                      {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <Flex px={3} minHeight={2} flex={1} flexDir="column" gap={2}>
              <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

              {tabValue === "posts" ? (
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
              ) : (
                <Flex minHeight={2} flex={1} px={3} gap={2} flexDir="column">
                  <FlashList
                    data={teammates?.data}
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={50}
                    renderItem={({ item }) => (
                      <Flex flexDirection="column" my={2}>
                        <Flex flexDir="row" alignItems="center" gap={3}>
                          <AvatarPlaceholder image={item?.image} name={item?.name} size="md" borderRadius="full" />
                          <Flex>
                            <Text fontWeight={500} fontSize={14} color="#3F434A">
                              {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                            </Text>
                            <Text fontWeight={400} fontSize={12} color="#20A144">
                              {item?.position_name}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    )}
                  />
                </Flex>
              )}
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
