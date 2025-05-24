import Lottie from "lottie-react";
import LoadingAnimation from "../../assets/LoadingAnimation.json";

// eslint-disable-next-line react/prop-types
function Spinner({ small }) {
  if (small) {
    // Small CSS spinner
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-gray-500 w-4 h-4"></div>
      </div>
    );
  }

  // Full-page Lottie loading animation 
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Lottie animationData={LoadingAnimation} className="w-60 h-60" />
    </div>
  );
}

export default Spinner;
