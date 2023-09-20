export const useJoinWithNoDuplicate = (arr1 = [], arr2 = [], propName1 = "", propName2 = "") => {
  let result = [];

  const a = new Set(arr1.map((x) => x[propName1]));
  const b = new Set(arr2.map((x) => x[propName2]));
  result = [...arr1.filter((x) => !b.has(x[propName1])), ...arr2.filter((x) => !a.has(x[propName2]))];

  return { result };
};
