import { ActivityIndicator, Dimensions, Platform, View } from "react-native";
import { FlashList } from "react-native-actions-sheet";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import LeaveRequestItem from "./LeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const LeaveRequestList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  refetch,
  refetchPersonal,
  isLoading,
  onSelect,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {data?.length > 0 ? (
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
              leave_name={item?.leave_name}
              reason={item?.reason}
              days={item?.days}
              begin_date={item?.begin_date}
              end_date={item?.end_date}
              status={item?.status}
              approval_by={item?.approval_by}
              onSelect={onSelect}
              supervisor_name={item?.supervisor_name}
            />
          )}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                refetch();
                refetchPersonal();
              }}
            />
          }
        >
          <View style={{ alignItems: "center", justifyContent: "center", height: height }}>
            <EmptyPlaceholder height={250} width={250} text="No Data" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default LeaveRequestList;
