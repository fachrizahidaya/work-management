export const useGetSubMenu = (menu) => {
  const mergedMenu = [];

  const processMenuItems = (items, isTopLevel) => {
    items.forEach((item) => {
      if (item.sub && item.sub.length > 0) {
        processMenuItems(item.sub, false);
      }
      if (!isTopLevel) {
        // Exclude top-level items from being directly pushed into mergedMenu
        mergedMenu.push(item);
      }
    });
  };

  menu.menu && processMenuItems(menu.menu, true);

  return {
    mergedMenu,
  };
};
