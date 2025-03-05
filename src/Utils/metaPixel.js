import ReactPixel from "react-facebook-pixel";

export const initFacebookPixel = () => {
  const pixelId = import.meta.env.VITE_PIXEL_ID;

  if (!pixelId) {
    console.warn("Facebook Pixel ID is missing.");
    return;
  }

  ReactPixel.init(pixelId);
  ReactPixel.pageView(); // Tracks page visits

  console.log("Facebook Pixel initialized.");
};

