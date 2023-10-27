import { useNavigation } from "@react-navigation/native";

import { Flex, Image, Skeleton, Text, VStack } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import TeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/TeamLeaveRequestList";
import useCheckAccess from "../../../../hooks/useCheckAccess";

const TeamLeaveScreen = ({ route }) => {
  const navigation = useNavigation();

  const { teamLeaveRequest, teamLeaveRequestIsLoading, refetchTeamLeaveRequest, teamLeaveRequestIsFetching } =
    route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader width={200} title="My Team Leave Request" onPress={() => navigation.goBack()} />
      </Flex>
      {!teamLeaveRequestIsLoading ? (
        teamLeaveRequest?.data.length > 0 ? (
          <FlashList
            data={teamLeaveRequest?.data}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={5}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            estimatedItemSize={100}
            refreshControl={
              <RefreshControl refreshing={teamLeaveRequestIsFetching} onRefresh={refetchTeamLeaveRequest} />
            }
            renderItem={({ item }) => (
              <>
                <TeamLeaveRequestList
                  key={item?.id}
                  id={item?.id}
                  name={item?.employee_name}
                  image={item?.employee_image}
                  leaveName={item?.leave_name}
                  days={item?.days}
                  startDate={item?.begin_date}
                  endDate={item?.end_date}
                  status={item?.status}
                  reason={item?.reason}
                  type={item?.approval_type}
                  objectId={item?.approval_object_id}
                  object={item?.approval_object}
                  refetchTeamLeaveRequest={refetchTeamLeaveRequest}
                />
              </>
            )}
          />
        ) : (
          <VStack space={2} alignItems="center" justifyContent="center">
            <Image
              source={require("../../../../assets/vectors/empty.png")}
              resizeMode="contain"
              size="2xl"
              alt="empty"
            />
            <Text>No Data</Text>
          </VStack>
        )
      ) : (
        <VStack px={3} space={2}>
          <Skeleton h={41} />
          <Skeleton h={41} />
          <Skeleton h={41} />
        </VStack>
      )}
    </SafeAreaView>
  );
};

export default TeamLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
