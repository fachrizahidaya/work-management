import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import * as DocumentPicker from "expo-document-picker";

import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import axiosInstance from "../../../../config/api";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";
import PageHeader from "../../../../components/shared/PageHeader";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import KPIDetailItem from "../../../../components/Tribe/Performance/KPI/KPIDetailItem";
import KPIDetailList from "../../../../components/Tribe/Performance/KPI/KPIDetailList";
import KPIForm from "../../../../components/Tribe/Performance/KPI/KPIForm";
import Button from "../../../../components/shared/Forms/Button";
import SuccessModal from "../../../../components/shared/Modal/SuccessModal";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import Tabs from "../../../../components/shared/Tabs";
import AttachmentForm from "../../../../components/Tribe/Performance/KPI/AttachmentForm";

const KPIScreen = () => {
  const [kpiValues, setKpiValues] = useState([]);
  const [employeeKpiValue, setEmployeeKpiValue] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [employeeKpi, setEmployeeKpi] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [tabValue, setTabValue] = useState("KPI");

  const navigation = useNavigation();

  const route = useRoute();

  const formScreenSheetRef = useRef(null);
  const formAttachmentScreenSheetRef = useRef(null);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);
  const { isOpen: saveModalIsOpen, toggle: toggleSaveModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const { id, isExpired, status } = route.params;

  const { data: kpiSelected } = useFetch(`/hr/employee-kpi/${id}/start`);

  const kpiId = kpiSelected?.data?.id;

  const { data: kpiList, refetch: refetchKpiList } = useFetch(`/hr/employee-kpi/${kpiId}`);

  /**
   * Handle selected KPI item
   * @param {*} data
   * @param {*} value
   */
  const openSelectedKpi = (data, value) => {
    setKpi(data);
    setEmployeeKpi(value);
    formScreenSheetRef.current?.show();
  };
  const closeSelectedKpi = () => {
    formScreenSheetRef.current?.hide();
  };

  const tabs = useMemo(() => {
    return [
      {
        title: `KPI`,
        value: "KPI",
      },
      { title: `Attachment`, value: "Attachment" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

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
            attachment: val?.attachment,
          },
        ];
      });
    }
    return [...employeeKpiValArr];
  };

  /**
   * Handle update value of KPI item
   * @param {*} data
   */
  const employeeKpiValueUpdateHandler = (data) => {
    setEmployeeKpiValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex(
        (employee_kpi_val) =>
          // employee_kpi_val?.performance_kpi_value_id === data?.performance_kpi_value_id
          employee_kpi_val?.id === data?.id
      );
      if (index > -1) {
        currentData[index].actual_achievement = data?.actual_achievement;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const employeeKpiAttachmentUpdateHandler = (data, setStatus, setSubmitting) => {
    setEmployeeKpiValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex(
        (employee_kpi_val) =>
          // employee_kpi_val?.performance_kpi_value_id === data?.performance_kpi_value_id
          employee_kpi_val?.id === data?.id
      );
      if (index > -1) {
        currentData[index].attachment = [...currentData[index].attachment, data?.file];
      }
      return [...currentData];
    });
    setStatus("success");
    setSubmitting(false);
  };

  const employeeKpiAttachmentDeleteHandler = (employee_kpi_id, id, att_index) => {
    if (att_index > -1) {
      setEmployeeKpiValue((prevState) => {
        let currentData = [...prevState];
        const index = currentData.findIndex((employee_kpi_val) => employee_kpi_val?.id === employee_kpi_id);
        if (index > -1) {
          currentData[index].attachment.splice(att_index, 1);
          if (id) {
            currentData[index].deleted_attachment = [];
            currentData[index].deleted_attachment = [...currentData[index].deleted_attachment, id];
          }
        }
        return [...currentData];
      });
    }
  };

  /**
   * Handle array of update KPI item
   */
  const sumUpKpiValue = () => {
    setKpiValues(() => {
      const performanceKpiValue = kpiList?.data?.performance_kpi?.value;
      const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
      return [...employeeKpiValue, ...performanceKpiValue];
    });
  };

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange("actual_achievement", e);
    }
    setFormValue(formik.values);
  };

  /**
   * Handle saved actual achievement value to be can saved or not
   * @param {*} kpiValues
   * @param {*} employeeKpiValue
   * @returns
   */
  const compareActualAchievement = (kpiValues, employeeKpiValue) => {
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
  };

  let differences = compareActualAchievement(kpiValues, employeeKpiValue);

  /**
   * Handle convert integer to string for KPI
   */
  if (!kpi?.actual_achievement) {
    var actualString = null;
  } else {
    var actualString = kpi?.actual_achievement.toString();
  }

  /**
   * Handle save filled or updated KPI
   */
  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(`/hr/employee-kpi/${kpiList?.data?.id}`, {
        kpi_value: employeeKpiValue,
      });
      toggleSaveModal();
      setRequestType("info");
      // Toast.show("Data saved!", SuccessToastProps);
      refetchKpiList();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      toggleSubmit();
    } finally {
      toggleSubmit();
    }
  };

  /**
   * Handle select file for attendance attachment
   */
  const selectFileHandler = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });
        } else {
          Toast.show("Max file size is 3MB", ErrorToastProps);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle create kpi value
   */
  const formik = useFormik({
    initialValues: {
      performance_kpi_value_id: kpi?.performance_kpi_value_id || kpi?.id,
      actual_achievement:
        // achievement || 0,
        actualString || 0,
    },
    validationSchema: yup.object().shape({
      actual_achievement: yup
        .number()
        .required("Value is required")
        .min(0, "Value should not be negative")
        .max(kpi?.target, "Value should not exceed target"),
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

  const formikAttachment = useFormik({
    initialValues: {
      performance_kpi_value_id: "",
      file: "",
    },
    // validationSchema: yup.object().shape({
    //   file
    // }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setSubmitting("processing");
    },
    enableReinitialize: true,
  });

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
            title={kpiList?.data?.performance_kpi?.review?.description}
            backButton={true}
            onPress={() => {
              if (differences.length === 0) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />
          {isExpired || kpiValues.length === 0 ? null : (
            <Button
              height={35}
              padding={10}
              children={
                submitIsLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: "#FFFFFF",
                    }}
                  >
                    Save
                  </Text>
                )
              }
              onPress={() => {
                if (submitIsLoading || differences.length === 0) {
                  null;
                } else {
                  submitHandler();
                }
              }}
              disabled={differences.length === 0 || submitIsLoading}
            />
          )}
        </View>
        <KPIDetailList
          dayjs={dayjs}
          begin_date={kpiList?.data?.performance_kpi?.review?.begin_date}
          end_date={kpiList?.data?.performance_kpi?.review?.end_date}
          target={kpiList?.data?.performance_kpi?.target_name}
          target_level={kpiList?.data?.performance_kpi?.target_level}
        />

        <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
        </View>

        <View style={styles.container}>
          {tabValue === "KPI" ? (
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              {kpiValues && kpiValues.length > 0 ? (
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
                      handleOpen={status === "ongoing" ? openSelectedKpi : null}
                      employeeKpiValue={correspondingEmployeeKpi}
                      status={status}
                    />
                  );
                })
              ) : (
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              <TouchableOpacity
                onPress={() => formAttachmentScreenSheetRef.current?.show()}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 14 }}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#304FFD" />
                <Text style={[{ color: "#304FFD", fontWeight: "500" }]}>Add Attachment</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
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
        handleClose={closeSelectedKpi}
        achievement={kpi?.actual_achievement}
        target={kpi?.target}
        achievementValue={employeeKpi?.actual_achievement}
        onSelectFile={selectFileHandler}
        fileAttachment={fileAttachment}
        attachment={kpi?.attachment}
      />
      <AttachmentForm reference={formAttachmentScreenSheetRef} onSelectFile={selectFileHandler} kpiValues={kpiValues} />
      <SuccessModal
        isOpen={saveModalIsOpen}
        toggle={toggleSaveModal}
        type={requestType}
        title="Changes saved!"
        description="Data has successfully updated"
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
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
