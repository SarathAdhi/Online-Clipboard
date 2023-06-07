export const getDummyProfileImage = (
  keyword: string,
  category: string = "adventurer-neutral"
) => {
  return `https://avatars.dicebear.com/api/${category}/${encodeURI(
    keyword
  )}.svg`;
};

export const getBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
