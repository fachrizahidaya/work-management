import React from "react";

import { Select } from "native-base";

const TeamSelection = ({ onChange, selectedTeamId, teams }) => {
  return (
    <Select defaultValue={selectedTeamId} onValueChange={(value) => onChange(value)}>
      <Select.Item value={0} label="Select Team" />
      {teams.length > 0 &&
        teams.map((team) => {
          return <Select.Item key={team.id} value={team.id} label={team.name} />;
        })}
    </Select>
  );
};

export default TeamSelection;
