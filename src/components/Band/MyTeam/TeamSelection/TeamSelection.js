import React, { memo } from "react";

import { Icon, Select } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TeamSelection = ({ onChange, selectedTeamId, teams }) => {
  return (
    <Select
      selectedValue={selectedTeamId}
      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
      onValueChange={(value) => onChange(value)}
    >
      <Select.Item value={0} label="Select Team" />
      {teams.length > 0 &&
        teams.map((team) => {
          return <Select.Item key={team.id} value={team.id} label={team.name} />;
        })}
    </Select>
  );
};

export default memo(TeamSelection);
