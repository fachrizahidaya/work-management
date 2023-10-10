import React from "react";

import { Icon, Select } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TeamSelection = ({ onChange, selectedTeam, teams }) => {
  return (
    <Select
      selectedValue={selectedTeam?.name || ""}
      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
    >
      <Select.Item value={""} label="Select Team" onPress={() => onChange({})} />
      {teams.length > 0 &&
        teams.map((team) => {
          return <Select.Item key={team.id} value={team.name} label={team.name} onPress={() => onChange(team)} />;
        })}
    </Select>
  );
};

export default TeamSelection;
