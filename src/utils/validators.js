export const string_validator = (data, min, max) => {
  if (!data) return false;
  else if (data.trim().length > max || data.trim().length < min) return false;
  else return true;
};
export const number_validator = (data, min, max) => {
  if (!data || !Number(data)) return false;
  else if (data > max || data < min) return false;
  else return true;
};
