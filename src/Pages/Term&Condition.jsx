// import React from "react";

function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
      <p className="text-gray-600 mb-4">
        These Terms and Conditions (&quot;Terms&quot;) govern your use of Fozato (the &quot;App&quot;) provided by 
        <span className="font-semibold"> Fathimakutty </span> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). 
        By using the App, you agree to these Terms and our Privacy Policy. We may update these 
        Terms periodically, and it is your responsibility to review them regularly.
      </p>

      {/* Section 1 - Use of the App */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">1. Use of the App</h2>
        <ul className="list-disc pl-6 text-gray-600 mt-2">
          <li>You must provide accurate and complete information during registration and are responsible for all activity on your account.</li>
          <li>The App and its content are proprietary to us. You have no rights to the intellectual property of the App.</li>
          <li>You agree not to use the App for illegal purposes or in violation of these Terms.</li>
        </ul>
      </section>

      {/* Section 2 - Disclaimers */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">2. Disclaimers</h2>
        <p className="text-gray-600 mt-2">
          We do not warrant the accuracy, timeliness, or completeness of information on the App. 
          Your use of the App is at your own risk.
        </p>
        <p className="text-gray-600 mt-2">
          The App may contain links to third-party sites. We are not responsible for their content or policies.
        </p>
      </section>

      {/* Section 3 - Payment and Refunds */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">3. Payment and Refunds</h2>
        <p className="text-gray-600 mt-2">
          As Fozato is provided on a subscription basis, no refunds are applicable for payments made. 
          Refer to our <span className="font-semibold text-blue-600 cursor-pointer">Refund Policy</span> for more details.
        </p>
      </section>

      {/* Section 4 - Liability */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">4. Liability</h2>
        <p className="text-gray-600 mt-2">
          We are not liable for any indirect, incidental, or consequential damages arising from your use of the App.
        </p>
      </section>

      {/* Section 5 - Governing Law */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">5. Governing Law</h2>
        <p className="text-gray-600 mt-2">
          These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction 
          of the courts in Malappuram, Kerala.
        </p>
      </section>

      {/* Section 6 - Contact Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">6. Contact Information</h2>
        <p className="text-gray-600 mt-2">
          For any questions regarding these Terms, please contact us at 
          <span className="font-semibold text-blue-600"> support@fozato.com</span>.
        </p>
      </section>
    </div>
  );
}

export default TermsAndConditions;
