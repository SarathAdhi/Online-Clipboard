import ShortUniqueId from "short-unique-id";

export const uuid = (length = 5) => {
  const uid = new ShortUniqueId({ length });
  uid.setDictionary("number");
  return uid();
};

export const uuidCharactor = (length = 5) => {
  const uid = new ShortUniqueId({ length });
  uid.setDictionary("alpha_lower");
  return uid();
};
