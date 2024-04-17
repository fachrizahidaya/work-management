import { Linking } from "react-native";
import Toast from "react-native-root-toast";

import axiosInstance from "../../../../config/api";
import { ErrorToastProps } from "../../../shared/CustomStylings";

/**
 * Handle selected KPI item
 * @param {*} data
 * @param {*} value
 */
export const openSelectedKpi = (data, value, setKpi, setEmployeeKpi, reference) => {
  setKpi(data);
  setEmployeeKpi(value);
  reference.current?.show();
};

export const closeSelectedKpi = (reference) => {
  reference.current?.hide();
};

export const attachmentDownloadHandler = async (file_path) => {
  try {
    Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
  } catch (err) {
    console.log(err);
  }
};

export const getEmployeeKpiValue = (employee_kpi_value) => {
  let employeeKpiValArr = [];
  employee_kpi_value?.map((val) => {
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
  return [...employeeKpiValArr];
};

/**
 * Handle update value of KPI item
 * @param {*} data
 */
export const employeeKpiValueUpdateHandler = (data, setEmployeeKpiValue) => {
  setEmployeeKpiValue((prevState) => {
    let currentData = [...prevState];
    const index = currentData.findIndex((employee_kpi_val) => employee_kpi_val?.id === data?.id);
    if (index > -1) {
      currentData[index].actual_achievement = data?.actual_achievement;
    } else {
      currentData = [...currentData, data];
    }
    return [...currentData];
  });
};

/**
 * Handle array of update KPI item
 */
export const sumUpKpiValue = (setKpiValues, kpiList) => {
  setKpiValues(() => {
    const performanceKpiValue = kpiList?.data?.performance_kpi?.value;
    const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
    return [...employeeKpiValue, ...performanceKpiValue];
  });
};

/**
 * Handle save filled or updated KPI
 */
export const submitHandler = async (
  toggleProcess,
  employeeKpiValue,
  kpiList,
  toggleModal,
  setRequestType,
  refetchKpiList
) => {
  try {
    toggleProcess();
    const formData = new FormData();
    employeeKpiValue.forEach((kpiObj, index) => {
      Object.keys(kpiObj).forEach((key) => {
        if (Array.isArray(kpiObj[key])) {
          kpiObj[key].forEach((att_obj, att_index) => {
            formData.append(`kpi_value[${index}][${key}][${att_index}]`, att_obj);
          });
        } else {
          formData.append(`kpi_value[${index}][${key}]`, kpiObj[key]);
        }
      });
    });
    formData.append("_method", "PATCH");
    const res = await axiosInstance.post(`/hr/employee-kpi/${kpiList?.data?.id}`, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    toggleModal();
    setRequestType("info");
    refetchKpiList();
  } catch (err) {
    console.log(err);
    Toast.show(err.response.data.message, ErrorToastProps);
    toggleProcess();
  } finally {
    toggleProcess();
  }
};

/**
 * Handle saved actual achievement value to be can saved or not
 * @param {*} kpiValues
 * @param {*} employeeKpiValue
 * @returns
 */
export const compareActualAchievement = (kpiValues, employeeKpiValue) => {
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
