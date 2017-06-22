export function invert(obj) {
  const inverted = {};
  Object.keys(obj).forEach((key) => {
    inverted[obj[key]] = key;
  });
  return inverted;
}

export function sort(arr, prop, reverse = false) {
  return arr.sort((a, b) => {
    if (prop(a) === prop(b)) {
      return 0;
    }
    if (prop(a) < prop(b)) {
      return reverse ? 1 : -1;
    }
    return reverse ? -1 : 1;
  });
}
