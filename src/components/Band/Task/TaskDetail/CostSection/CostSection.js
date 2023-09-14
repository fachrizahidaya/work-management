import React from "react";

import { FormControl, Input } from "native-base";

const CostSection = () => {
  return (
    <FormControl>
      <FormControl.Label>COST</FormControl.Label>
      <Input
        style={{ height: 40 }}
        variant="unstyled"
        borderWidth={1}
        borderRadius={15}
        placeholder="Task's cost"
        editable={false}
      />
    </FormControl>
  );
};

export default CostSection;
