export const getDummyProfileImage = (
  keyword: string,
  category: string = "adventurer-neutral"
) => {
  return `https://api.dicebear.com/7.x/${category}/svg?seed=${keyword}`;
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
