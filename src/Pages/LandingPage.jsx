import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Navbar */}
      <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-4 px-6 fixed top-0 left-0 flex items-center">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SkillXera Logo"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-white text-xl font-bold">SkillXera</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white flex flex-col items-center justify-center px-6 text-center">
        <motion.img
          src={logo}
          alt="SkillXera Logo"
          className="w-24 sm:w-32 h-24 sm:h-32 rounded-2xl mx-auto mb-4 animate-none "
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wide">
          Welcome to Skill
          <span className="text-green-400 text-5xl sm:text-6xl ">X</span>era
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mt-4 max-w-lg">
          Empowering your learning journey with top-tier skills.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold py-3 px-6 rounded-lg"
            onClick={() => navigate("/signin")}
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white text-black text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Why Choose SkillXera?
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            "High-Quality Courses",
            "Flexible Learning",
            "Global Community",
          ].map((feature, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={index}
              className="p-6 bg-green-500 text-white rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold">{feature}</h3>
              <p className="mt-2">Learn from industry experts.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-gradient-to-r from-[#004d40] to-[#1a1a1a] text-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Our Services</h2>
        <p className="text-base sm:text-lg text-gray-300 mt-4 max-w-xl mx-auto">
          We offer a wide range of services to help you excel in your career,
          from industry certifications to personalized mentorship.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "Personalized Mentorship",
            "Industry Certifications",
            "Live Workshops",
          ].map((service, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={index}
              className="p-6 bg-blue-600 text-white rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold">{service}</h3>
              <p className="mt-2">
                Get hands-on experience and grow your expertise.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-black text-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold">
          What Our Students Say
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {[
            "Amazing platform!",
            "Great learning experience.",
            "Helped me land my dream job!",
          ].map((testimonial, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={index}
              className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-xs"
            >
              <p className="text-lg">{testimonial}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-8 text-center text-gray-400 px-4">
        <p>&copy; {new Date().getFullYear()} SkillXera. All Rights Reserved.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link to="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
