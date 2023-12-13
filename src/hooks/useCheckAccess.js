import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useCheckAccess = (action_name, current_path) => {
  const [checkAccess, setCheckAccess] = useState(true);
  const userMenuSelector = useSelector((state) => state.user_menu);

  useEffect(() => {
    /*
     * Search if current path is found in the logged in user's available menus
     * and return the sub menu containing the related path
     *
     * @param current_path
     * @returns
     */
    const searchMenu = (current_path) => {
      const parent_menu = userMenuSelector.user_menu.menu?.filter((menu) => {
        if (!menu.sub.length) {
          return menu.name === current_path;
        } else {
          return menu.sub.some((subMenu) => {
            return subMenu.name === current_path;
          });
        }
      });

      if (parent_menu) {
        if (!parent_menu[0]?.sub?.length) {
          if (parent_menu[0]?.name === current_path) {
            return [parent_menu[0]];
          }
        } else {
          const sub_menu = parent_menu[0]?.sub.filter((sub) => {
            return sub.name === current_path;
          });
          return sub_menu;
        }
      }
    };

    // look for the sub menu to access the actions within
    const sub_menu = searchMenu(current_path);

    /*
     * If there is a list of available actions, then we will loop through it
     * and check if action_name is found in the list of actions and if the action itself
     * is true (or available to the user's client side)
     */
    if (sub_menu) {
      if (sub_menu[0].actions) {
        const result = Object.keys(sub_menu[0].actions).some((action) => {
          return action === action_name && sub_menu[0].actions[action] === true;
        });
        setCheckAccess(result);
      }
    } else {
      setCheckAccess(false);
    }
  }, [userMenuSelector, current_path, action_name]);

  return checkAccess;
};

export default useCheckAccess;
