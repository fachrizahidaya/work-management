import React from "react";
import MentionSelectItem from "./MentionSelectItem";
import { Flex } from "native-base";

const MentionSelect = ({ employees, onSelect }) => {
  return (
    <Flex>
      {employees?.slice(0, 10).map((employee) => {
        return (
          <MentionSelectItem
            key={employee.id}
            image={employee.image}
            name={employee.name}
            username={employee.username}
            onSelect={onSelect}
          />
        );
      })}
    </Flex>
  );
};

export default MentionSelect;
