import React from "react";

import { Select } from "native-base";

const TeamSelection = ({ onChange, selectedTeam, teams }) => {
  return (
    <Select selectedValue={selectedTeam?.name || ""}>
      <Select.Item value={""} label="Select Team" onPress={() => onChange({})} />
      {teams.length > 0 &&
        teams.map((team) => {
          return <Select.Item key={team.id} value={team.name} label={team.name} onPress={() => onChange(team)} />;
        })}
    </Select>
  );
};

export default TeamSelection;
