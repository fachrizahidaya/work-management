import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import { useFetch } from "../../../hooks/useFetch";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PerformanceForm from "../../../components/Tribe/Performance/PerformanceForm";
import axiosInstance from "../../../config/api";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";

const KPIScreen = () => {
  const [question, setQuestion] = useState(null);
  const [kpiValues, setKpiValues] = useState([]);
  const [employeeKpiValue, setEmployeeKpiValue] = useState([]);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const { data: kpiSelected } = useFetch(`/hr/employee-kpi/${id}/start`);

  const kpiId = kpiSelected?.data?.id;

  const { data: kpiList } = useFetch(`/hr/employee-kpi/${kpiId}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const selectedQuestionHandler = (value) => {
    // setQuestion(value);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedQuestionHandler = () => {
    // setQuestion(null);
    formScreenSheetRef.current?.hide();
  };

  const getEmployeeKpiValue = (employee_kpi_value) => {
    let employeeKpiValArr = [];
    if (Array.isArray(employee_kpi_value)) {
      employee_kpi_value.forEach((val) => {
        employeeKpiValArr = [
          ...employeeKpiValArr,
          {
            ...val?.performance_kpi_value,
            id: val?.id,
            performance_kpi_value: val?.performance_kpi_value_id,
            actual_achievement: val?.actual_achievement,
          },
        ];
      });
    }
    return [...employeeKpiValArr];
  };

  const employeeKpiValueUpdateHandler = (data) => {
    setEmployeeKpiValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex(
        (employee_kpi_val) => employee_kpi_val?.performance_kpi_value_id === data?.performance_kpi_value_id
      );
      if (index > -1) {
        currentData[index].actual_achievement = data?.actual_achievement;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const sumUpKpiValue = () => {
    setKpiValues(() => {
      const performanceKpiValue = kpiList?.data?.performance_kpi?.value;
      const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
      return [...employeeKpiValue, ...performanceKpiValue];
    });
  };

  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(`/hr/employee-kpi/${kpiList?.data?.id}`, {
        kpi_value: employeeKpiValue,
      });
      toggleSubmit();
      Toast.show("Data saved!", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleSubmit();
      Toast.show(err.response.data.message, ErrorToastProps);
    } finally {
      toggleSubmit();
    }
  };

  useEffect(() => {
    if (kpiList?.data) {
      sumUpKpiValue();
      setEmployeeKpiValue(() => {
        const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
        return [...employeeKpiValue];
      });
    }
  }, [kpiList?.data]);

  useEffect(() => {
    console.log("here", employeeKpiValue);
  }, [employeeKpiValue]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity
            onPress={() => {
              submitHandler();
              navigation.goBack();
            }}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <KPIDetailList
          dayjs={dayjs}
          begin_date={kpiList?.data?.performance_kpi?.review?.begin_date}
          end_date={kpiList?.data?.performance_kpi?.review?.end_date}
          position={kpiList?.data?.performance_kpi?.target_level}
          target={kpiList?.data?.performance_kpi?.target_name}
          targetLevel={kpiList?.data?.performance_kpi?.target_level}
        />

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {kpiValues &&
              kpiValues.length > 0 &&
              kpiValues.map((item, index) => {
                return (
                  <KPIDetailItem
                    id={item?.employee_kpi_value || item?.id}
                    key={index}
                    item={item}
                    description={item?.description}
                    target={item?.target}
                    navigation={navigation}
                    type="kpi"
                    weight={item?.weight}
                    threshold={item?.threshold}
                    measurement={item?.measurement}
                    actual={item?.actual_achievement}
                    onChange={employeeKpiValueUpdateHandler}
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
      {/* <PerformanceForm
        formik={formik}
        reference={formScreenSheetRef}
        onChange={employeeKpiValueUpdateHandler}
        kpiValues={kpiValues}
        formikChangeHandler={formikChangeHandler}
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
      /> */}
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
