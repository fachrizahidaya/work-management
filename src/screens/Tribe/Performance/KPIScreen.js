import React, { useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import { useFetch } from "../../../hooks/useFetch";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";

const KPIScreen = () => {
  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const { data: kpiList } = useFetch(`/hr/performance-appraisal/${id}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <KPIDetailList
          dayjs={dayjs}
          begin_date={kpiList?.data?.begin_date}
          end_date={kpiList?.data?.end_date}
          name={kpiList?.data?.description}
          position={kpiList?.data?.target_level}
        />

        <View style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <FlashList
              data={kpiList?.data?.value}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <KPIDetailItem
                  description={item?.description}
                  question={item?.measurement}
                  target={item?.target}
                  navigation={navigation}
                  reference={formScreenSheetRef}
                  threshold={item?.threshold}
                  weight={item?.weight}
                  type="kpi"
                />
              )}
            />
          </View>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
      />
    </>
  );
};

export default KPIScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
