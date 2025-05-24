import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axiosInstance from "../../Connection/Axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ToasterHot from "../Common/ToasterHot";
import ReactPixel from "react-facebook-pixel";
import { loadRazorpayScript } from "../../Utils/RazorpayScript";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Spinner from "../Common/spinner";

const PaymentPage = () => {
  const { type, id } = useParams();
  const BASE_URL = axiosInstance.defaults.baseURL;

  const [checkoutData, setCheckoutData] = useState({
    checkoutPage: null,
    product: null,
    orderBumps: [],
    loading: true,
    error: null,
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [selectedBumps, setSelectedBumps] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cashfree");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axiosInstance.get(
          `/sale/get-checkout-page-details/${type}/${id}`
        );

        const { checkoutPage, product, orderBumps } = response.data.data;

        setCheckoutData({
          checkoutPage,
          product,
          orderBumps,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        setCheckoutData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch checkout data",
        }));
        toast.error("Failed to fetch checkout data");
      }
    };

    fetchCheckoutData();
  }, [type, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleOrderBump = (bump) => {
    setSelectedBumps((prev) =>
      prev.some((b) => b._id === bump._id)
        ? prev.filter((b) => b._id !== bump._id)
        : [...prev, bump]
    );
  };

  const calculateTotal = () => {
    const productPrice = checkoutData.product?.salesPrice || 0;
    const bumpsTotal = selectedBumps.reduce(
      (sum, bump) => sum + bump.bumpPrice,
      0
    );
    return productPrice + bumpsTotal;
  };

  const verifyRazorpayPayment = async (paymentData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/sale/salespage/verify-razorpay-payment",
        paymentData,
        type
      );

      if (response.data.success) {
        const verificationData = {
          verified: true,
          payment: response.data.payment,
          user: response.data.user,
          resetLink: response.data.resetLink || "",
          timestamp: Date.now(),
        };

        ReactPixel.track("Purchase", {
          value: response.data.payment.amount,
          currency: "INR",
        });

        localStorage.setItem(
          `paymentVerification_${paymentData.razorpay_order_id}`,
          JSON.stringify(verificationData)
        );

        window.location.href = `/sale/payment-success?order_id=${paymentData.razorpay_order_id}&verified=true&type=${paymentData.type}&productId=${paymentData.productId}&gateway=razorpay&payment_id=${paymentData.razorpay_payment_id}`;
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      toast.error("Error verifying payment");
      console.error("Verification Error:", error);
    } finally {
      setLoading(false); // stop loading no matter what
    }
  };
  const handlePayment = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (checkoutData.loading) return;
    if (!checkoutData.product || !checkoutData.product.salesPrice) {
      setIsSubmitting(false);
      return toast.error("Invalid product price");
    }

    const amount = calculateTotal();
    if (isNaN(amount) || amount <= 0) {
      setIsSubmitting(false);
      return toast.error("Invalid pricing");
    }

    if (paymentMethod === "cashfree") {
      handleCashfreePayment(amount);
    } else if (paymentMethod === "razorpay") {
      handleRazorpayPayment(amount);
    }
  };

  const handleCashfreePayment = async (amount) => {
    try {
      ReactPixel.track("InitiateCheckout", {
        content_name: checkoutData.product.title,
        content_ids: [
          checkoutData.product._id,
          ...selectedBumps.map((b) => b.bumpProduct._id),
        ],
        value: amount,
        currency: "INR",
      });

      const cashfree = await load({ mode: "sandbox" });

      const rawPhone = formData.phone.replace(/\D/g, "");

      const response = await axiosInstance.post(
        "/sale/salespage/create-cashfree-order",
        {
          amount: amount,
          currency: "INR",
          productId: checkoutData.product._id,

          orderBumps: selectedBumps.map((bump) => ({
            productId: bump.bumpProduct._id,
            price: bump.bumpPrice,
            name: bump.displayName,
            description: bump.description,
          })),
          customer_details: {
            customer_name: formData.username,
            customer_email: formData.email,
            customer_phone: rawPhone,
          },
        }
      );

      if (!response.data.payment_session_id) {
        throw new Error("Invalid Payment Session ID");
      }

      cashfree.checkout({
        paymentSessionId: response.data.payment_session_id,
        return_url: `${
          import.meta.env.VITE_FRONTEND_URL
        }/sale/payment-success?order_id=${
          response.data.cf_order_id
        }&productId=${
          checkoutData.product._id
        }&gateway=cashfree&amount=${amount}`,
      });
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Payment failed. Please try again.");
      }
      console.error("Payment Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async (amount) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const amountInPaise = Math.round(amount * 100);

      const response = await axiosInstance.post(
        "/sale/salespage/create-razorpay-order",
        {
          amount: amountInPaise,
          currency: "INR",
          productId: checkoutData.product._id,
          type, // Include type parameter
          orderBumps: selectedBumps.map((bump) => bump._id), // Send just the IDs
          customer_details: {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
          },
        }
      );

      const { id: order_id, currency } = response.data.data || {};

      if (!order_id) {
        throw new Error("Invalid Razorpay response: Missing order ID");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: currency || "INR",
        order_id: order_id,
        name: import.meta.env.VITE_SKILLXERA_COMPANY_NAME,
        description: `${checkoutData.product.title}${
          selectedBumps.length > 0
            ? ` with ${selectedBumps.length} order bump${
                selectedBumps.length > 1 ? "s" : ""
              }`
            : ""
        }`,
        notes: {
          // Add important details to notes
          type,
          productId: checkoutData.product._id,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        },
        handler: function (response) {
          verifyRazorpayPayment({
            razorpay_order_id: order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: checkoutData.product._id,
            type: type,
          });
        },
        prefill: {
          name: formData.username,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Payment failed. Please try again.");
      }
      console.error("Payment Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  if (checkoutData.loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  if (checkoutData.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: {checkoutData.error}
      </div>
    );
  }
  {
    loading && (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Verifying payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {checkoutData.checkoutPage && (
        <div className="bg-gray-800 text-center py-6">
          <h1
            className="text-3xl font-bold"
            dangerouslySetInnerHTML={renderHTML(
              checkoutData.checkoutPage.topHeading
            )}
          />
        </div>
      )}

      <div className="p-6 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start">
        <div className="md:w-1/2">
          {checkoutData.checkoutPage && (
            <>
              <h2
                className="text-xl font-semibold"
                dangerouslySetInnerHTML={renderHTML(
                  checkoutData.checkoutPage.subHeading
                )}
              />
            </>
          )}

          {checkoutData.checkoutPage?.checkoutImage && (
            <img
              src={`${BASE_URL}/uploads/${checkoutData.checkoutPage.checkoutImage}`}
              alt="Checkout"
              className="mt-4 rounded-lg shadow-lg w-full max-w-md bg-white"
            />
          )}

          {checkoutData.checkoutPage.lines &&
            checkoutData.checkoutPage.lines.map((line, index) => (
              <div
                key={index}
                className="mt-2"
                dangerouslySetInnerHTML={renderHTML(line)}
              />
            ))}
        </div>

        <div className="md:w-1/2 mt-6 md:mt-0 md:pl-10">
          <h3 className="text-yellow-400 text-lg font-semibold">
            Contact Information
          </h3>
          <form className="mt-4 space-y-4" onSubmit={handlePayment}>
            <input
              name="username"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-black"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-black"
              required
            />
            <PhoneInput
              name="phone"
              placeholder="  Phone"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              className="w-full px-4 py-2 border space-x-3 border-gray-600 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            {/* Order Bumps Section */}
            {checkoutData.orderBumps?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-yellow-400 text-lg font-semibold mb-3">
                  Special Offers
                </h3>
                <div className="space-y-3">
                  {checkoutData.orderBumps.map((bump) => (
                    <div
                      key={bump._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedBumps.some((b) => b._id === bump._id)
                          ? "border-yellow-400 bg-gray-700"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      onClick={() => toggleOrderBump(bump)}
                    >
                      <div className="flex items-start gap-3">
                        {bump.checkoutImage && (
                          <img
                            src={`${BASE_URL}/uploads/${bump.checkoutImage}`}
                            alt={bump.displayName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{bump.displayName}</h4>
                            <span className="text-yellow-400">
                              +₹{bump.bumpPrice}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">
                            {bump.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span>Product:</span>
                <span>₹{checkoutData.product?.salesPrice || 0}</span>
              </div>

              {selectedBumps.map((bump) => (
                <div
                  key={bump._id}
                  className="flex justify-between text-sm text-gray-300"
                >
                  <span>{bump.displayName}:</span>
                  <span>+₹{bump.bumpPrice}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-700">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cashfree"
                  checked={paymentMethod === "cashfree"}
                  onChange={() => setPaymentMethod("cashfree")}
                  className="accent-yellow-400"
                />
                Cashfree
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="accent-yellow-400"
                />
                Razorpay
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded-md font-bold mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay Now ₹${calculateTotal()}`}
            </button>
          </form>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
};

export default PaymentPage;
