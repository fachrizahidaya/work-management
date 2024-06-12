import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import CommentResultDetailItem from "../../../../components/Tribe/Performance/Result/CommentResultDetailItem";
import PerformanceResultDetailList from "../../../../components/Tribe/Performance/Result/PerformanceResultDetailList";
import KPIResultDetailItem from "../../../../components/Tribe/Performance/Result/KPIResultDetailItem";
import AppraisalResultDetailItem from "../../../../components/Tribe/Performance/Result/AppraisalResultDetailItem";
import ConclusionResultDetailItem from "../../../../components/Tribe/Performance/Result/ConclusionResultDetailItem";
import axiosInstance from "../../../../config/api";
import { ErrorToastProps } from "../../../../components/shared/CustomStylings";
import Button from "../../../../components/shared/Forms/Button";
import { useLoading } from "../../../../hooks/useLoading";

const PerformanceResultScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const { id, type } = route.params;

  const { toggle, isLoading } = useLoading(false);

  const { data: comment } = useFetch(`/hr/performance-result/personal/${id}`);
  const { data: teamComment } = useFetch(`/hr/performance-result/my-team/${id}`);

  const exportPdfHandler = async (setSubmitting, setStatus) => {
    toggle();
    try {
      const res = await axiosInstance.get(`/hr/performance-result/${id}/download`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res.data?.data}`);
      toggle();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      toggle();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader
          width={200}
          title={
            type === "personal"
              ? comment?.data?.performance_review?.description
              : teamComment?.data?.performance_review?.description
          }
          backButton={true}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button height={35} padding={10} onPress={() => exportPdfHandler()} disabled={isLoading}>
          {!isLoading ? (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              Download as PDF
            </Text>
          ) : (
            <ActivityIndicator />
          )}
        </Button>
      </View>

      <PerformanceResultDetailList
        dayjs={dayjs}
        begin_date={
          type === "personal"
            ? comment?.data?.performance_review?.begin_date
            : teamComment?.data?.performance_review?.begin_date
        }
        end_date={
          type === "personal"
            ? comment?.data?.performance_review?.end_date
            : teamComment?.data?.performance_review?.end_date
        }
        name={type === "personal" ? null : teamComment?.data?.employee?.name}
        type={type}
      />

      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <KPIResultDetailItem
            employeeKPI={
              type === "personal"
                ? comment?.data?.conclusion?.employee?.item[0]
                : teamComment?.data?.conclusion?.employee?.item[0]
            }
            supervisorKPI={
              type === "personal"
                ? comment?.data?.conclusion?.supervisor?.item[0]
                : teamComment?.data?.conclusion?.supervisor?.item[0]
            }
            employeeAppraisal={null}
            supervisorAppraisal={null}
            employee_score={
              type === "personal"
                ? comment?.data?.employee_kpi?.employee_kpi_value_sum_score
                : teamComment?.data?.employee_kpi?.employee_kpi_value_sum_score
            }
            supervisor_score={
              type === "personal"
                ? comment?.data?.employee_kpi?.employee_kpi_value_sum_supervisor_score
                : teamComment?.data?.employee_kpi?.employee_kpi_value_sum_supervisor_score
            }
          />
          <AppraisalResultDetailItem
            id={type === "personal" ? comment?.data?.comment?.id : teamComment?.data?.comment?.id}
            type={type}
            grade={
              type === "personal"
                ? comment?.data?.conclusion?.supervisor?.grade
                : teamComment?.data?.conclusion?.supervisor?.grade
            }
            employeeKPI={null}
            supervisorKPI={null}
            employeeAppraisal={
              type === "personal"
                ? comment?.data?.conclusion?.employee?.item[1]
                : teamComment?.data?.conclusion?.employee?.item[1]
            }
            supervisorAppraisal={
              type === "personal"
                ? comment?.data?.conclusion?.supervisor?.item[1]
                : teamComment?.data?.conclusion?.supervisor?.item[1]
            }
            navigation={navigation}
            employee_score={
              type === "personal"
                ? comment?.data?.employee_appraisal?.employee_appraisal_value_sum_score
                : teamComment?.data?.employee_appraisal?.employee_appraisal_value_sum_score
            }
            supervisor_score={
              type === "personal"
                ? comment?.data?.employee_appraisal?.employee_appraisal_value_sum_supervisor_score
                : teamComment?.data?.employee_appraisal?.employee_appraisal_value_sum_supervisor_score
            }
          />
          <CommentResultDetailItem
            total_comment={
              type === "personal"
                ? comment?.data?.comment?.employee_review_comment_value
                : teamComment?.data?.comment?.employee_review_comment_value
            }
            navigation={navigation}
            id={type === "personal" ? comment?.data?.comment?.id : teamComment?.data?.comment?.id}
            type={type}
          />
          <ConclusionResultDetailItem
            navigation={navigation}
            id={type === "personal" ? comment?.data?.comment?.id : teamComment?.data?.comment?.id}
            type={type}
            employee_grade={
              type === "personal"
                ? comment?.data?.conclusion?.employee?.grade
                : teamComment?.data?.conclusion?.employee?.grade
            }
            supervisor_grade={
              type === "personal"
                ? comment?.data?.conclusion?.employee?.grade
                : teamComment?.data?.conclusion?.employee?.grade
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PerformanceResultScreen;

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
