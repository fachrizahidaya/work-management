import React, { memo } from "react";

import Select from "../../../shared/Forms/Select";

const TeamSelection = ({ onChange, selectedTeam, teams }) => {
  return (
    <Select
      value={selectedTeam?.name}
      onChange={(value) => onChange(value)}
      items={
        teams.length > 0 &&
        teams.map((team) => {
          return { value: team.id, label: team.name };
        })
      }
    />
  );
};

export default memo(TeamSelection);
