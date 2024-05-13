import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MyTeamLeaveRequestItem from "./MyTeamLeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const MyTeamLeaveRequestList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  refetch,
  refetchTeam,
  isLoading,
  formik,
  isSubmitting,
  handleResponse,
}) => {
  return data.length > 0 ? (
    <View
      style={{
        height: "100%",
      }}
    >
      <FlashList
        data={data}
        onEndReachedThreshold={0.1}
        onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
        onEndReached={hasBeenScrolled === true ? fetchMore : null}
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshing={true}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
              refetchTeam();
            }}
          />
        }
        ListFooterComponent={() => isLoading && <ActivityIndicator />}
        renderItem={({ item, index }) => (
          <MyTeamLeaveRequestItem
            item={item}
            key={index}
            id={item?.id}
            leave_name={item?.leave_name}
            reason={item?.reason}
            days={item?.days}
            begin_date={item?.begin_date}
            end_date={item?.end_date}
            status={item?.status}
            employee_name={item?.employee_name}
            employee_image={item?.employee_image}
            handleResponse={handleResponse}
            isSubmitting={isSubmitting}
            formik={formik}
          />
        )}
      />
    </View>
  ) : (
    <ScrollView
      style={{ height: "100%" }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => {
            refetch();
            refetchTeam();
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

export default MyTeamLeaveRequestList;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
