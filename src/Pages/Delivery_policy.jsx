function Delivery_Policy() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-gray-300 shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-white mb-2">Shipping & Delivery Policy</h1>
        <p className="text-sm text-gray-400 mb-6">
          Fozato is a digital product. There is no physical shipping involved.
        </p>
  
        {/* Section 1 - Digital Delivery */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">1. Digital Delivery</h2>
          <p className="mt-2">
            All content and features of Fozato are delivered electronically. You will receive access immediately upon
            subscription.
          </p>
        </section>
  
        {/* Section 2 - No Shipping Charges */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">2. No Shipping Charges</h2>
          <p className="mt-2">
            As there are no physical products, no shipping charges apply.
          </p>
        </section>
  
        {/* Section 3 - Support */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">3. Support</h2>
          <p className="mt-2">
            If you have issues accessing the App or need assistance, contact us at{" "}
            <span className="text-blue-400 cursor-pointer">support@fozato.com</span>.
          </p>
        </section>
  
        {/* Section 4 - Policy Updates */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">4. Policy Updates</h2>
          <p className="mt-2">
            This policy may be updated. Please review it regularly for any changes.
          </p>
        </section>
      </div>
    );
  }
  
  export default Delivery_Policy;
  