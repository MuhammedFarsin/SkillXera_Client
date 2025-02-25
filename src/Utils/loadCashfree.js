export const loadCashfree = async () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    }
  });
};
