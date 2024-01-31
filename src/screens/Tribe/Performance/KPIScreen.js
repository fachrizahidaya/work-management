import React, { useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import { useFetch } from "../../../hooks/useFetch";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PerformanceForm from "../../../components/Tribe/Performance/PerformanceForm";
import axiosInstance from "../../../config/api";

const KPIScreen = () => {
  const [question, setQuestion] = useState(null);
  const [value, setValue] = useState(null);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const actualString = actual?.toString();

  const temporaryArray = [];

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      actual_achievement: actualString || "",
    },
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const formData = new FormData();
      for (let key in values) {
        if (key === "actual_achievement") {
          const num = Number(values.actual_achievement);
          formData.append(key, num);
        }
      }
      formData.append("_method", "PATCH");
    },
  });

  const submitKPIactual = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch();
    } catch (err) {
      console.log(err);
    }
  };

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
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {kpiList?.data?.kpi_value &&
              kpiList?.data?.kpi_value.length > 0 &&
              kpiList?.data?.kpi_value.map((item, index) => {
                return (
                  <KPIDetailItem
                    key={index}
                    item={item}
                    description={item?.performance_kpi_value?.description}
                    target={item?.performance_kpi_value?.target}
                    navigation={navigation}
                    type="kpi"
                    onSelect={selectedQuestionHandler}
                  />
                );
              })}
            {kpiList?.data?.performance_kpi?.value &&
              kpiList?.data?.performance_kpi?.value.length > 0 &&
              kpiList?.data?.performance_kpi?.value.map((item, index) => {
                return (
                  <KPIDetailItem
                    key={index}
                    item={item}
                    description={item?.description}
                    target={item?.target}
                    navigation={navigation}
                    type="kpi"
                    onSelect={selectedQuestionHandler}
                  />
                );
              })}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
      <PerformanceForm
        formik={formik}
        reference={formScreenSheetRef}
        threshold={
          question?.performance_kpi_value?.threshold || question?.performance_kpi_value?.threshold == 0
            ? question?.performance_kpi_value?.threshold
            : question?.threshold
        }
        weight={
          question?.performance_kpi_value?.weight || question?.performance_kpi_value?.weight == 0
            ? question?.performance_kpi_value?.weight
            : question?.weight
        }
        measurement={
          question?.performance_kpi_value?.measurement || question?.performance_kpi_value?.measurement == 0
            ? question?.performance_kpi_value?.measurement
            : question?.measurement
        }
        description={
          question?.performance_kpi_value?.description
            ? question?.performance_kpi_value?.description
            : question?.description
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
