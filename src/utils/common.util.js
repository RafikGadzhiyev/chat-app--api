function convertArrayToObject(array, keyCallback, options = {}) {
  const {
    multipleValuesPerKey = false,
  } = options;

  const result = {};

  if (typeof keyCallback !== 'function') {
    keyCallback = (item) => item[keyCallback];
  }

  for (let i = 0; i < array.length; i += 1) {
    const itemKey = keyCallback(array[i]);

    if (!multipleValuesPerKey) {
      result[itemKey] = array[i];
    } else {
      if (!result[itemKey]) {
        result[itemKey] = [];
      }

      result[itemKey]
        .push(array[i]);
    }
  }

  return result;
}

module.exports = {
  convertArrayToObject,
};
