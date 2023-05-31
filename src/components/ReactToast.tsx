import { Toaster } from "react-hot-toast";

const ReactToast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: "font-medium",
      }}
    />
  );
};

export default ReactToast;
