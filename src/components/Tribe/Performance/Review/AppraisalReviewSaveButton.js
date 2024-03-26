import React from "react";
import { ActivityIndicator, Text } from "react-native";
import Button from "../../../shared/Forms/Button";

const AppraisalReviewSaveButton = ({ isLoading, differences, onSubmit }) => {
  return (
    <Button
      height={35}
      padding={10}
      onPress={() => {
        if (isLoading || differences.length === 0) {
          null;
        } else {
          onSubmit();
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

export default AppraisalReviewSaveButton;
