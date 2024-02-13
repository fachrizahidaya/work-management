import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";

import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../../components/shared/PageHeader";
import KPIDetailItem from "../../../../components/Tribe/Performance/KPIList/KPIDetailItem";
import KPIDetailList from "../../../../components/Tribe/Performance/KPIList/KPIDetailList";
import { useFetch } from "../../../../hooks/useFetch";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import axiosInstance from "../../../../config/api";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";
import KPIForm from "../../../../components/Tribe/Performance/Form/KPIForm";
import Button from "../../../../components/shared/Forms/Button";

const KPIScreen = () => {
  const [kpiValues, setKpiValues] = useState([]);
  const [employeeKpiValue, setEmployeeKpiValue] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [employeeKpi, setEmployeeKpi] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const formScreenSheetRef = useRef(null);

  const { id } = route.params;

  const { data: kpiSelected } = useFetch(`/hr/employee-kpi/${id}/start`);

  const kpiId = kpiSelected?.data?.id;

  const { data: kpiList, refetch: refetchKpiList } = useFetch(`/hr/employee-kpi/${kpiId}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const openSelectedKpi = (data, value) => {
    setKpi(data);
    setEmployeeKpi(value);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedKpi = () => {
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
            performance_kpi_value_id: val?.performance_kpi_value_id,
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
      Toast.show("Data saved!", SuccessToastProps);
      refetchKpiList();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      toggleSubmit();
    } finally {
      toggleSubmit();
    }
  };

  if (!kpi?.actual_achievement) {
    var actualString = null;
  } else {
    var actualString = kpi?.actual_achievement.toString();
  }

  const formik = useFormik({
    initialValues: {
      performance_kpi_value_id: kpi?.performance_kpi_value_id || kpi?.id,
      actual_achievement:
        // achievement || 0,
        actualString || 0,
    },
    validationSchema: yup.object().shape({
      actual_achievement: yup.number().required("Value is required").min(0, "Value should not be negative"),
    }),
    onSubmit: (values) => {
      if (formik.isValid) {
        if (values.actual_achievement) {
          values.actual_achievement = Number(values.actual_achievement);
        } else {
          values.actual_achievement = null;
        }
        employeeKpiValueUpdateHandler(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange("actual_achievement", e);
    }
    setFormValue(formik.values);
  };

  function compareActualAchievement(kpiValues, employeeKpiValue) {
    let differences = [];

    for (let empKpi of employeeKpiValue) {
      let kpiValue = kpiValues.find((kpi) => kpi.id === empKpi.id);

      if (kpiValue && kpiValue.actual_achievement !== empKpi.actual_achievement) {
        differences.push({
          id: empKpi.id,
          difference: empKpi.actual_achievement - kpiValue.actual_achievement,
        });
      }
    }

    return differences;
  }

  let differences = compareActualAchievement(kpiValues, employeeKpiValue);

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue]);

  useEffect(() => {
    if (kpiList?.data) {
      sumUpKpiValue();
      setEmployeeKpiValue(() => {
        const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
        return [...employeeKpiValue];
      });
    }
  }, [kpiList?.data]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="Employee KPI"
            backButton={true}
            onPress={() => {
              if (differences.length === 0) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />

          <Button
            height={35}
            padding={10}
            children={submitIsLoading ? <ActivityIndicator/> :  <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}>Save</Text>}
            onPress={() => {
              if (submitIsLoading || differences.length === 0) {
                null;
              } else {
                submitHandler();
              }
            }}
            disabled={differences.length === 0 || submitIsLoading}
          />
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
                const correspondingEmployeeKpi = employeeKpiValue.find((empKpi) => empKpi.id === item.id);
                return (
                  <KPIDetailItem
                    key={index}
                    description={item?.description}
                    target={item?.target}
                    weight={item?.weight}
                    threshold={item?.threshold}
                    measurement={item?.measurement}
                    achievement={item?.actual_achievement}
                    item={item}
                    handleOpen={openSelectedKpi}
                    employeeKpiValue={correspondingEmployeeKpi}
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
      <KPIForm
        reference={formScreenSheetRef}
        threshold={kpi?.threshold}
        weight={kpi?.weight}
        measurement={kpi?.measurement}
        description={kpi?.description}
        formik={formik}
        onChange={formikChangeHandler}
        handleClose={closeSelectedKpi}
        achievement={kpi?.actual_achievement}
        target={kpi?.target}
        achievementValue={employeeKpi?.actual_achievement}
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
