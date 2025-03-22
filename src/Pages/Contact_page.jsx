function ContactPage() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-gray-300 shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
  
        {/* Merchant Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">Merchant Details</h2>
          <p className="mt-2">
            <span className="font-semibold">Legal Entity Name:</span> Fozato
          </p>
        </section>
  
        {/* Address */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">Registered & Operational Address</h2>
          <p className="mt-2">
            Eaeakkadavath, Nattayamanagalam, <br />
            Chundampatta PO, Palakkad, Kerala - 679337
          </p>
        </section>
  
        {/* Contact Email */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-white">Email</h2>
          <p className="mt-2">
            For any inquiries, reach out to us at{" "}
            <span className="text-blue-400 cursor-pointer">support@fozato.com</span>.
          </p>
        </section>
      </div>
    );
  }
  
  export default ContactPage;
  