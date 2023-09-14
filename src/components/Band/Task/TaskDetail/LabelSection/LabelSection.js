import React from "react";

import { FormControl, IconButton, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LabelSection = () => {
  return (
    <FormControl>
      <FormControl.Label>LABELS</FormControl.Label>
      <IconButton
        size="md"
        borderRadius="full"
        icon={<Icon as={<MaterialCommunityIcons name="plus" />} color="black" />}
        alignSelf="flex-start"
      />
    </FormControl>
  );
};

export default LabelSection;
