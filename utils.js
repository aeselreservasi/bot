const storage = {
  get(key, defaultValue = null) {
    const value = GM_getValue(key);
    return value === undefined ? defaultValue : value;
  },
  set(key, value) {
    GM_setValue(key, value);
  },
  remove(key) {
    GM_setValue(key, undefined);
  }
};
