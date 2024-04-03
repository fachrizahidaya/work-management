import { ActivityIndicator, Text } from "react-native";
import Button from "../../../shared/Forms/Button";

const KPIReviewSaveButton = ({
  isLoading,
  differences,
  onSubmit,
  toggleSubmit,
  employeeKpiValue,
  kpiList,
  toggleSaveModal,
  setRequestType,
  refetchKpiList,
}) => {
  return (
    <Button
      height={35}
      padding={10}
      onPress={() => {
        if (isLoading || differences.length === 0) {
          null;
        } else {
          onSubmit(toggleSubmit, employeeKpiValue, kpiList, toggleSaveModal, setRequestType, refetchKpiList);
        }
      }}
      disabled={differences.length === 0 || isLoading}
    >
      {isLoading ? (
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
      )}
    </Button>
  );
};

export default KPIReviewSaveButton;
