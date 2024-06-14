import { Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import CourierItem from "./CourierItem";
import EmptyPlaceholder from "../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const CourierList = ({ data, isFetching, refetch, isLoading, renderSkeletons }) => {
  return (
    <View style={styles.container}>
      {!isLoading ? (
        data?.length > 0 ? (
          <FlashList
            data={data}
            estimatedItemSize={50}
            refreshing={true}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
            renderItem={({ item, index }) => (
              <CourierItem key={index} name={item?.name} prefix={item?.prefix_code_awb} image={item?.image} />
            )}
          />
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )
      ) : (
        <View style={{ paddingHorizontal: 14, paddingVertical: 16, gap: 2 }}>{renderSkeletons()}</View>
      )}
    </View>
  );
};

export default CourierList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
