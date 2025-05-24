import LoadingAnimation from "../../assets/LoadingAnimation.json";
import Lottie from "lottie-react";

function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Lottie animationData={LoadingAnimation} className="w-60 h-60" />
    </div>
  );
}

export default LoadingPage;
