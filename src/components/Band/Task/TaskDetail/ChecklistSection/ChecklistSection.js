import React from "react";

import { Flex, FormControl, Icon, Slider, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChecklistSection = ({ checklistFinishPercent, totalChecklist, totalChecklistFinish }) => {
  return (
    <FormControl>
      <FormControl.Label>CHECKLIST ({checklistFinishPercent})</FormControl.Label>
      <Slider defaultValue={(totalChecklist / totalChecklistFinish) * 100} size="sm" colorScheme="blue" w="100%">
        <Slider.Track bg="blue.100">
          <Slider.FilledTrack bg="blue.600" />
        </Slider.Track>
        <Slider.Thumb borderWidth="0" bg="transparent" display="none"></Slider.Thumb>
      </Slider>

      <TouchableOpacity>
        <Flex flexDir="row" alignItems="center" gap={3}>
          <Icon as={<MaterialCommunityIcons name="plus" />} color="blue.600" size="md" />
          <Text color="blue.600">Add checklist item</Text>
        </Flex>
      </TouchableOpacity>
    </FormControl>
  );
};

export default ChecklistSection;
