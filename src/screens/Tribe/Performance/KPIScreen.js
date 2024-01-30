import React, { useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import { useFetch } from "../../../hooks/useFetch";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PerformanceForm from "../../../components/Tribe/Performance/PerformanceForm";

const KPIScreen = () => {
  const [question, setQuestion] = useState(null);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const { data: kpiSelected } = useFetch(`/hr/employee-kpi/${id}/start`);

  const kpiId = kpiSelected?.data?.id;

  const { data: kpiList } = useFetch(`/hr/employee-kpi/${kpiId}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const selectedQuestionHandler = (value) => {
    setQuestion(value);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedQuestionHandler = () => {
    setQuestion(null);
    formScreenSheetRef.current?.hide();
  };

  const objectKPI = kpiList?.data?.performance_kpi?.value[1];

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
          begin_date={kpiSelected?.data?.begin_date}
          end_date={kpiSelected?.data?.end_date}
          position={kpiList?.data?.performance_kpi?.target_level}
        />

        <View style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            {kpiList?.data?.kpi_value ? (
              <FlashList
                data={kpiList?.data?.kpi_value}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <KPIDetailItem
                    item={item}
                    description={item?.performance_kpi_value?.description}
                    target={item?.performance_kpi_value?.target}
                    navigation={navigation}
                    type="kpi"
                    onSelect={selectedQuestionHandler}
                  />
                )}
              />
            ) : null}
            {kpiList?.data?.performance_kpi?.value ? (
              <FlashList
                data={kpiList?.data?.performance_kpi?.value}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <KPIDetailItem
                    item={item}
                    description={item?.description}
                    target={item?.target}
                    navigation={navigation}
                    type="kpi"
                    onSelect={selectedQuestionHandler}
                  />
                )}
              />
            ) : null}
            {/* {kpiList?.data?.performance_kpi?.value.length >= 2 ? null : (
              <KPIDetailItem
                target={objectKPI?.target}
                actual={objectKPI?.actual}
                description={objectKPI?.description}
                type="kpi"
                onSelect={selectedQuestionHandler}
                item={objectKPI}
              />
            )} */}
          </View>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
      <PerformanceForm
        reference={formScreenSheetRef}
        threshold={
          question?.performance_kpi_value?.threshold || question?.performance_kpi_value?.threshold == 0
            ? question?.performance_kpi_value?.threshold
            : question?.threshold || objectKPI?.threshold
        }
        weight={
          question?.performance_kpi_value?.weight || question?.performance_kpi_value?.weight == 0
            ? question?.performance_kpi_value?.weight
            : question?.weight || objectKPI?.weight
        }
        measurement={
          question?.performance_kpi_value?.measurement || question?.performance_kpi_value?.measurement == 0
            ? question?.performance_kpi_value?.measurement
            : question?.measurement || objectKPI?.measurement
        }
        description={
          question?.performance_kpi_value?.description
            ? question?.performance_kpi_value?.description
            : question?.description || objectKPI?.description
        }
        actual={
          question?.actual_achievement || question?.actual_achievement == 0
            ? question?.actual_achievement
            : question?.actual_achievement
        }
        onClose={closeSelectedQuestionHandler}
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
