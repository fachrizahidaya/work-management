import React from "react";

import { Avatar } from "native-base";

const AvatarPlaceholder = ({ image, name }) => {
  const userInitialGenerator = () => {
    const nameArray = name.split(" ");
    let alias = "";

    if (nameArray.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return (
    <>
      {image ? (
        <Avatar
          source={{
            uri: `https://dev.kolabora-app.com/api-dev/image/${image}/thumb`,
          }}
          size="xs"
        />
      ) : (
        <Avatar size="xs">{userInitialGenerator()}</Avatar>
      )}
    </>
  );
};

export default AvatarPlaceholder;
