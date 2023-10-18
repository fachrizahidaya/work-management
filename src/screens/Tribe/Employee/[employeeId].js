import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Icon, Image, Pressable } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import FeedCardItem from "../../../components/Tribe/Feed/FeedCardItem";
import { useDisclosure } from "../../../hooks/useDisclosure";
import EmployeeContact from "../../../components/Tribe/Employee/EmployeeContact";
import EmployeeTeammates from "../../../components/Tribe/Employee/EmployeeTeammates";
import EmployeeProfile from "../../../components/Tribe/Employee/EmployeeProfile";
import EmployeeSelfProfile from "../../../components/Tribe/Employee/EmployeeSelfProfile";

const EmployeeProfileScreen = ({ route }) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const { employeeId, returnPage, loggedEmployeeImage } = route.params;

  const { isOpen: teammatesIsOpen, toggle: toggleTeammates } = useDisclosure(false);
  const { isOpen: newFeedIsOpen, close: closeNewFeed, toggle: toggleNewFeed } = useDisclosure(false);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: employee,
    isFetching: employeeIsFetching,
    refetch: refetchEmployee,
  } = useFetch(`/hr/employees/${employeeId}`);

  const {
    data: teammates,
    refetch: refetchTeammates,
    isFetching: teammatesIsFetching,
  } = useFetch(`/hr/employees/${employeeId}/team`);

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedsIsFetching,
  } = useFetch(!fetchIsDone && `/hr/posts/personal/${employee?.data?.id}`, [currentOffset], postFetchParameters);

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      setIsHeaderSticky(true);
    } else {
      setIsHeaderSticky(false);
    }
  };

  const postEndReachedHandler = () => {
    if (!fetchIsDone) {
      if (posts.length !== posts.length + feeds?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

  useEffect(() => {
    if (feeds?.data) {
      if (currentOffset === 0) {
        setPosts(feeds?.data);
      } else {
        setPosts((prevData) => [...prevData, ...feeds?.data]);
      }
    }
  }, [feeds?.data]);

  // useEffect(() => {
  //   console.log(posts);
  // }, [posts]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex style={isHeaderSticky ? styles.stickyHeader : styles.header}>
        <PageHeader
          title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
          onPress={() => navigation.navigate(returnPage)}
        />
      </Flex>

      <Pressable
        style={styles.createIcon}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={() => {
          navigation.navigate("New Feed", {
            toggleNewFeed: toggleNewFeed,
            refetch: postRefetchHandler,
            loggedEmployeeImage: loggedEmployeeImage,
            loggedEmployeeName: userSelector?.name,
          });
        }}
      >
        <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
      </Pressable>

      <ScrollView onScroll={handleScroll}>
        <Image
          source={require("../../../assets/profile_banner.jpg")}
          alignSelf="center"
          h={200}
          w={500}
          alt="empty"
          resizeMode="cover"
        />
        <Flex flex={1} gap={5}>
          <Flex px={3} position="relative" flexDir="column" bgColor="#FFFFFF">
            {userSelector?.id !== employee?.data?.user_id ? (
              <>
                <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
                  <EmployeeContact employee={employee} />
                </Flex>

                <EmployeeProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
              </>
            ) : (
              <EmployeeSelfProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
            )}

            <EmployeeTeammates
              teammatesIsOpen={teammatesIsOpen}
              toggleTeammates={toggleTeammates}
              teammates={teammates}
            />
          </Flex>

          <Flex px={3} minHeight={2} flex={1} flexDir="column" gap={2}>
            <FlashList
              data={posts}
              keyExtractor={(item, index) => index}
              onEndReached={posts.length ? postEndReachedHandler : null}
              onEndReachedThreshold={0.1}
              refreshControl={<RefreshControl refreshing={feedsIsFetching} onRefresh={refetchFeeds} />}
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
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  createIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
