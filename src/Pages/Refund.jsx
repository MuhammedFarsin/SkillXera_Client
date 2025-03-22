function Refund() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-gray-300 shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-white mb-2">Refund & Cancellation Policy</h1>
      <p className="text-sm text-gray-400 mb-6">
        Since Fozato is a digital product, no refunds are applicable once the subscription has been purchased.
      </p>

      {/* Section 1 - Refund Eligibility */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-white">1. Refund Eligibility</h2>
        <p className="mt-2">
          No refunds will be issued for any payments made. Please ensure you review the subscription details before
          making a purchase.
        </p>
      </section>

      {/* Section 2 - Issues and Support */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-white">2. Issues and Support</h2>
        <p className="mt-2">
          If you experience issues with the App or have questions about your subscription, contact us at{" "}
          <span className="text-blue-400 cursor-pointer">support@fozato.com</span>.
        </p>
      </section>

      {/* Section 3 - Policy Changes */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-white">3. Policy Changes</h2>
        <p className="mt-2">
          We reserve the right to modify this policy without prior notice. Review this policy periodically.
        </p>
      </section>
    </div>
  );
}

export default Refund;
