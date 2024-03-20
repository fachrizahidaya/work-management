import React from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { FlashList } from "react-native-actions-sheet";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import LeaveRequestItem from "./LeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const LeaveList = ({
  data,
  teamLeaveRequestData,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  refetch,
  refetchPersonal,
  isLoading,
  onSelect,
}) => {
  return data?.length > 0 ? (
    <View
      style={{
        height:
          Platform.OS === "ios" && teamLeaveRequestData > 0
            ? 200
            : Platform.OS === "ios" && teamLeaveRequestData === 0
            ? "100%"
            : Platform.OS === "android" && teamLeaveRequestData === 0
            ? "100%"
            : 575,
      }}
    >
      <FlashList
        data={data}
        onEndReachedThreshold={0.1}
        onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
        onEndReached={hasBeenScrolled === true ? fetchMore : null}
        keyExtractor={(item, index) => index}
        estimatedItemSize={70}
        refreshing={true}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
              refetchPersonal();
            }}
          />
        }
        ListFooterComponent={() => isLoading && <ActivityIndicator />}
        renderItem={({ item, index }) => (
          <LeaveRequestItem
            item={item}
            key={index}
            id={item?.id}
            leave_name={item?.leave_name}
            reason={item?.reason}
            days={item?.days}
            begin_date={item?.begin_date}
            end_date={item?.end_date}
            status={item?.status}
            approval_by={item?.approval_by}
            onSelect={onSelect}
          />
        )}
      />
    </View>
  ) : (
    <ScrollView
      style={{ height: Platform.OS === "ios" ? 570 : 600 }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => {
            refetch;
            refetchPersonal();
          }}
        />
      }
    >
      <View style={styles.content}>
        <EmptyPlaceholder height={250} width={250} text="No Data" />
      </View>
    </ScrollView>
  );
};

export default LeaveList;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
