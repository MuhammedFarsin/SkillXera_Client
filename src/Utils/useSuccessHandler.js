import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useSuccessHandler = () => {
  const navigate = useNavigate();

  const handleSuccess = ({
    message = "Success!",
    salesPagePath = "",
    courseId = "",
    resetForm,
    resetDelay = 60000, // default: 1 minute
  }) => {
    toast.success(message, {
      action: {
        label: "Create Sales Page",
        onClick: () => {
          if (salesPagePath && courseId) {
            navigate(`${salesPagePath}/${courseId}`);
            resetForm && resetForm();
          }
        },
      },
      description: `Form will reset in ${resetDelay / 1000} seconds`,
    });

    if (resetForm) {
      setTimeout(() => {
        resetForm();
      }, resetDelay);
    }
  };

  return { handleSuccess };
};

export default useSuccessHandler;
