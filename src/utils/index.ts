/**
 * / _ - 转换成驼峰并将pages替换成空字符串
 * @param {*} name name
 */
export function toHump(name: string) {
  return name
    .replace(/[-/_](\w)/g, function (all, letter) {
      return letter.toUpperCase();
    })
    .replace('views', '');
}

/**
 * 将数组对象磨平
 * @param menuList
 * @param arr
 * @returns
 */
export const flatArrayObject = <T = any>(list: any[], keys: string[], arr: T[] = []): T[] => {
  list.forEach(item => {
    keys.forEach(key => {
      if (Array.isArray(item[key])) {
        flatArrayObject(item[key], keys, arr);
      } else {
        arr.push({ ...item });
      }
    });
  });
  return arr;
};
