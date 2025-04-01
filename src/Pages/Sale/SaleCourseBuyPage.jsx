import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Connection/Axios";
import ReactPixel from "react-facebook-pixel";
import VidalyticsPlayer from "../../Utils/VidalyticsPlayer";
import { Check } from "lucide-react";

function SaleCourseBuyPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/sale/buy-course/course/${courseId}`
        );
        setCourse(response.data);
        console.log(response);
      } catch (error) {
        setError("Failed to fetch course details");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleNavigate = (courseId) => {
    console.log("Navigating with Course ID:", courseId);
    if (!courseId) {
      console.warn("Course ID is missing");
      return;
    }
    ReactPixel.track("PageView", {
      value: course.salesPrice,
      currency: "INR",
      content_name: "SkillXera",
      content_category: "Online Course",
      content_ids: courseId,
      content_type: "product",
    });

    navigate(`/sale/buy-course/course/payment/${courseId}`);
  };

  console.log(courseId);

  if (loading)
    return <p className="text-white text-center">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!course) return <p className="text-white text-center">No course found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-black text-center">
      <h1 className="text-2xl lg:text-5xl font-bold text-[#e69b2f] leading-tight sm:mb-2 lg:mb-1">
        Experience the <span className="text-white"> Power of </span>
      </h1>

      <h2 className="text-[13px] mt-1 lg:text-4xl font-extrabold text-[#e69b2f] leading-tight">
        &quot;AUTOMATED YOUTUBE SEO WITH FOZATO SEO&quot;
      </h2>

      <p className="text-sm md:text-xl lg:text-xl text-gray-300 lg:mt-4 px-2">
        <span className="text-[16px] lg:text-2xl font-sans font-bold lg:font-extrabold text-[#e69b2f]">
          &quot;DOUBLE YOUR YOUTUBE VIEWS & REVENUE&quot;
          <span className="text-white"> with Our Revolutionary</span>
        </span>
      </p>

      <span className="text-white text-lg md:text-xl font-bold leading-snug px-2">
        YouTube SEO App, by Performing YouTube SEO Automatically!
      </span>

      <p className="mt-2 text-[14px] text-[#9b9b9b] lg:text-lg leading-snug font-semibold">
        (Join 5857+ satisfied users who have optimized{" "}
        <br className="hidden md:block" />
        <span className="font-semibold">
          their YouTube videos using Fozato SEO)
        </span>
      </p>

      <p className="mt-2 text-gray-400 text-[12px] lg:text-base font-semibold">
        (Even if you’ve never done SEO for YouTube videos before)
      </p>

      <div className="border-2 md:border-2 border-[#e69b2f] rounded-2xl lg:rounded-2xl px-4 py-2 md:px-6 md:py-3 inline-block mt-4 w-80 lg:w-2/4">
        <p className="text-white text-sm md:text-lg font-bold">
          <span className="text-[#ffffff] text-[8px] lg:text-[15px]">
            Fozato SEO:
          </span>
          <span className="text-[#e69b2f] text-[8px] lg:text-[15px]">
            {" "}
            The World’s First Most Powerful YouTube Ranking System
          </span>
        </p>
      </div>

      <div className="w-full md:w-4/6 mt-6 rounded border-2 lg:border-2 border-[#e69b2f]">
        <VidalyticsPlayer />
      </div>

      {/* After Video Content */}
      <button
        onClick={() => handleNavigate(courseId)}
        className="bg-[#FFA41C] text-black font-bold text-[11px] md:text-lg lg:text-3xl shadow-xl 
             leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
             mb-6 w-80 md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
      >
        &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
        <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
          (ONLY ₹{course.salesPrice}/3 Months)
        </span>
      </button>

      <div className="text-white lg:mt-10 text-center rounded-lg shadow-lg w-full max-w-4xl">
        <h3 className="text-[29px] font-bold mb-10 lg:mb-10 leading-tight">
          HERE IS WHAT YOU ARE GOING TO ACHIEVE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            {
              title: "Top Rankings on YouTube",
              description:
                "Automatically perform professional YouTube SEO to get your videos to the top.",
            },
            {
              title: "Maximize Revenue",
              description:
                "Increase YouTube income by 10 times with effective SEO strategies.",
            },
            {
              title: "Generate Optimized Content",
              description:
                "Discover the best keywords, titles, tags, and descriptions tailored to your video.",
            },
            {
              title: "Save Time and Effort",
              description:
                "Automate your YouTube SEO and focus on creating amazing content.",
            },
            {
              title: "Increase Viewership",
              description:
                "Attract more viewers with high CTR thumbnails and optimized SEO.",
            },
            {
              title: "Leverage Trends",
              description:
                "Utilize Google Trends & other tools to stay ahead in the game.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-3 lg:p-6 border-2 border-yellow-500 rounded-3xl bg-black text-white relative flex items-start gap-3"
            >
              {/* Check Icon */}
              <div className="w-4 h-4 flex items-center justify-center bg-yellow-500 rounded-full mt-2">
                <Check size={16} color="black" strokeWidth={3} />
              </div>

              {/* Content */}
              <div>
                <h4 className="font-bold text-lg text-white">{item.title}:</h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleNavigate(courseId)}
          className="bg-[#FFA41C] text-black font-bold text-[11px] md:text-lg lg:text-3xl shadow-xl 
             leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
             mb-6 w-full md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
        >
          &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
          <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
            (ONLY ₹{course.salesPrice}/3 Months)
          </span>
        </button>

        <p className="text-[18px] lg:text-[22px] text-gray-300 font-bold">
          Register quickly before{" "}
          <span className="text-[#E69B2F]"> the offer ends </span> to unlock
          bonuses worth <span className="text-[#E69B2F]"> ₹97,000</span>
        </p>
        <div className="bg-[#111111] h-20 lg:h-44 flex flex-col justify-center items-center text-center mt-4">
          <p className="font-bold text-white flex items-center space-x-1">
            <span className="text-[8px] lg:text-[22px]">Fozato SEO:</span>
            <span className="text-[#E69B2F] lg:text-[22px] text-[10px]">
              The World&apos;s First Most Powerful YouTube Ranking System
            </span>
          </p>

          <p className="text-[#E69B2F] text-[14px] font-bold mt-1 lg:text-[22px]">
            ***Hurry! Limited spots available for this offer!***
          </p>
        </div>

        <div className="mx-auto ">
          <p className="font-bold text-center text-[21px] lg:text-[32px] leading-[38px] text-[#9B9B9B]">
            Please Check All Boxes Where Your Answer Is{" "}
            <span className="text-yellow-500">YES!</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              "I want to get more views and subscribers on YouTube effortlessly",
              "I am a complete beginner in YouTube SEO with no prior experience or technical skills",
              "I am keen to explore automated SEO tools to enhance my YouTube channel without spending too much time",
              "I cannot afford expensive SEO services and seek cost-effective solutions",
              "I want to increase my YouTube revenue but don't know where to start",
              "My current videos are not getting the desired views and subscribers",
            ].map((text, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl flex items-start text-start lg:space-x-2 shadow-md"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 border-gray-400 rounded-md"
                />
                <span className="text-gray-800 lg:text-lg pl-3">{text}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-white font-semibold text-center text-[15px] lg:text-[25px]">
            If You Checked ANY Of The Boxes Above, Then You’re Invited To Use
            The
          </p>

          <p className="mt-2 lg:mt-7 text-white font-bold text-lg text-center text-[25px] lg:text-[45px] lg:whitespace-nowrap lg:flex justify-center">
            “FOZATO SEO YOUTUBE AUTO SEO APP”
          </p>

          <button
            onClick={() => handleNavigate(courseId)}
            className="bg-[#FFA41C] text-black font-extrabold text-[11px] md:text-lg lg:text-3xl shadow-xl 
             leading-tight py-3 px-2 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl lg:mt-16
             mb-6 w-full md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
          >
            &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
            <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
              (ONLY ₹{course.salesPrice}/3 Months)
            </span>
          </button>

          <p className="font-bold text-center lg:text-[22px]">
            Register quickly before{" "}
            <span className="text-[#E69B2F]">the offer ends </span> to unlock
            bonuses worth ₹97,000
          </p>

          {/* New Content Below */}

          {/* <div className="mt-5 text-center text-white "> */}
          <h2 className="text-2xl font-bold lg:text-[42px] lg:mt-20 lg:whitespace-nowrap">
            Unlock Your Potential in{" "}
            <span className="text-yellow-400">YouTube SEO Today!</span>
          </h2>
          <p className="mt-2 text-[#9b9b9b] font-semibold text-[16px] leading-tight lg:text-[29px]">
            With the right guidance and access to{" "}
            <span className="underline">cutting-edge tools</span>, you can rank
            your videos higher and grow your channel effortlessly!
          </p>

          <p className="mt-4 text-[#9b9b9b] font-semibold lg:font-normal text-[16px] leading-tight lg:mt-10 lg:text-[29px]">
            Whether you’re a complete novice with zero SEO experience <br />
            And have never attempted YouTube optimization before... <br />
            You need an Automated System that will do SEO for you.
          </p>

          <p className="mt-8 text-[#9b9b9b] font-semibold text-[16px] leading-tight lg:font-normal lg:text-[29px]">
            And That’s Exactly What You Will Experience In This
          </p>

          <h3 className="mt-2 text-[24px] lg:text-[42px] font-bold text-lg">
            “fozato SEO –{" "}
            <span className="text-yellow-500">YouTube Auto SEO App”</span>
          </h3>

          {/* Image Section */}
          <div className="flex justify-center mt-6 bg-white rounded-3xl lg:rounded">
            <img
              src={`${BASE_URL}${course.images[0]}`}
              alt="Fozato SEO - YouTube Auto SEO App"
              className="w-full lg:max-w-6xl lg:max-h-[500px] rounded-lg shadow-lg"
            />
          </div>
          <button
            onClick={() => handleNavigate(courseId)}
            className="bg-[#FFA41C] text-black font-extrabold text-[11px] md:text-lg lg:text-3xl shadow-xl 
             leading-tight py-3 px-2 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
             mb-6 w-full md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
          >
            &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
            <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
              (ONLY ₹{course.salesPrice}/3 Months)
            </span>
          </button>

          <div className="lg:mt-10 text-white bg-[#111111] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white lg:text-[20px]">
              {/* Left Side */}
              <div>
                <p className="flex items-start ">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2 text-start font-bold">
                    Stop Waiting and{" "}
                    <span className="text-[#E69B2F]">
                      Start Optimising Your YouTube Videos
                    </span>{" "}
                    in Less Than 3 Minutes ~ GUARANTEED!
                  </span>
                </p>

                <p className="flex items-start mt-4">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2 text-start font-bold">
                    Craft Seamless{" "}
                    <span className="text-[#CE981E] text-end">
                      Sales Pitches:
                    </span>
                    <span className="text-start text-white">
                      {" "}
                      Tailored to your industry and business needs.
                    </span>
                  </span>
                </p>

                <p className="flex items-start mt-4">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2 text-start font-bold text-[#CE981E]">
                    No More Reliance on Outdated Sales Tactics:
                    <span className="ml-1 text-white">
                      {" "}
                      Embrace the power of modern sales strategies.
                    </span>
                  </span>
                </p>
              </div>

              {/* Right Side */}
              <div>
                <p className="flex items-start">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2  text-start font-bold text-[#CE981E]">
                    Step-by-Step{" "}
                    <span className="text-[#CE981E]">Automated SEO </span>
                    <span className="font-bold text-white">
                      to Optimize Your YouTube Videos & Boost Channel&apos;s
                      Growth
                    </span>
                  </span>
                </p>

                <p className="flex items-start mt-4">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2 text-start font-bold text-white">
                    Learn to{" "}
                    <span className="text-[#CE981E]">
                      Leverage Tools for YouTube SEO
                    </span>{" "}
                    and Experience Freedom from Tedious Tasks
                  </span>
                </p>

                <p className="flex items-start mt-4">
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-2">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <span className="ml-2 text-start font-bold text-white">
                    Witness a{" "}
                    <span className="text-[#CE981E]">
                      Boost in Your Revenue
                    </span>{" "}
                    with High-Ranking SEO-Optimized Videos
                  </span>
                </p>
              </div>
            </div>
          </div>
          <h1 className="font-bold text-[22px]">BONUSES</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
            {course.images.slice(1, 7).map((image, index) => (
              <div
                key={index}
                className="bg-white text-white rounded-3xl shadow-lg mx-auto border border-gray-700 h-[425px] w-80 lg:w-72"
              >
                {/* Bonus Header */}
                <div className="relative flex justify-center">
                  <div className="bg-[#4A4A4A] text-yellow-400 py-2 px-6 rounded-full text-center font-bold w-56 text-lg absolute -top-5 shadow-md">
                    🎁 Bonus #{index + 1}:
                  </div>
                </div>

                {/* Image Section */}
                <div className="flex justify-center bg-white p-4 rounded-b-3xl mt-5">
                  <img
                    src={`${BASE_URL}${image}`}
                    alt={`Bonus ${index + 1}`}
                    className="w-full max-w-[250px] rounded-lg"
                  />
                </div>

                {/* Title */}
                <h3 className="text-center mt-4 font-bold text-lg text-[#34495E]">
                  {
                    [
                      "YouTube Viral Trending SEO",
                      "YouTube Evergreen SEO",
                      "YouTube Revenue SEO",
                      "YouTube Bulk SEO",
                      "YouTube Sales SEO",
                      "Extra 2 Month FREE",
                    ][index]
                  }
                </h3>

                {/* Price Tag */}
                <div className="mt-3 flex justify-center">
                  <button className="bg-white text-[#34495E] text-[20px] font-bold py-2 w-60 px-6 rounded-full shadow-md border border-gray-400">
                    Worth ₹{course.salesPrice}/-
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black text-white p-2 rounded-3xl shadow-lg w-full max-w-4xl mx-auto text-center">
            {/* Heading */}
            <h2 className="text-[22px] lg:text-[40px] font-bold">
              Get All This Inside The App
            </h2>

            {/* Pricing Info */}
            <p className="text-[#FFA500] lg:text-[40px] font-bold text-[19px] mt-2">
              Total Value Of Bonuses: ₹97,000
            </p>
            <p className="text-[19px] font-bold mt-1 lg:text-[40px]">
              Normal Course Ticket Price: ₹6999
            </p>

            {/* Offer Price Section */}
            <p className="text-[22px] font-bold mt-3 lg:text-[53px]">
              <span className="text-[#FFD700]">Join Today At Just</span>
            </p>
            <p className="text-2xl font-extrabold mt-1 lg:text-[53px]">
              <span className="text-gray-400 line-through">₹6999</span>
              <span className="text-[#7CDC12] ml-2">₹1999 </span>
              <span className="text-[#E69B2F]">Only</span>
            </p>

            {/* Urgency Message */}
            <p className="text-[15px] font-bold mt-2 lg:mt-10 lg:text-[32px]">
              Time is running out. Reserve your access now!
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center mt-4 w-full">
              <div className="bg-[#333] text-[#FFD700] py-3 px-6 text-center rounded-3xl flex flex-wrap justify-between items-center gap-3 lg:gap-6">
                <div className="text-center">
                  <p className="text-2xl lg:text-[44px] font-bold">10</p>
                  <p className="text-xs lg:text-lg text-white">HOURS</p>
                </div>
                <p className="text-2xl lg:text-[44px] font-bold">:</p>
                <div className="text-center">
                  <p className="text-2xl lg:text-[44px] font-bold">50</p>
                  <p className="text-xs lg:text-lg text-white">MINUTES</p>
                </div>
                <p className="text-2xl lg:text-[44px] font-bold">:</p>
                <div className="text-center">
                  <p className="text-2xl lg:text-[44px] font-bold">27</p>
                  <p className="text-xs lg:text-lg text-white">SECONDS</p>
                </div>
              </div>
            </div>

            {/* CTA Message */}
            <p className="font-bold text-center lg:text-[22px] leading-tight lg:mt-10">
              Register quickly before{" "}
              <span className="text-[#E69B2F]">the offer ends </span> to unlock
              bonuses worth <span className="text-[#E69B2F]"> ₹97,000</span>
            </p>
            <p className="mt-7 font-bold text-[18px] lg:text-[25px]">
              This app promises to be a game changer, showcasing the power of
              automated YouTube SEO!
            </p>

            {/* Call to Action Button */}
            <button
              onClick={() => handleNavigate(courseId)}
              className="bg-[#FFA41C] text-black font-bold text-[11px] md:text-lg lg:text-3xl shadow-xl 
     leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
     mb-6 w-80 md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
            >
              &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
              <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
                (ONLY ₹{course.salesPrice}/3 Months)
              </span>
            </button>
          </div>

          <p className="font-bold text-center lg:text-[22px] leading-tight lg:mt-10">
            Register quickly before{" "}
            <span className="text-[#E69B2F]">the offer ends </span> to unlock
            bonuses worth <span className="text-[#E69B2F]"> ₹97,000</span>
          </p>

          <h1 className="text-[23px] text-[#c9c6c6] font-bold lg:mt-10 lg:text-[50px]">
            Frequently Asked Questions
          </h1>
          <p className="text-[15px] text-[#6e7071] lg:text-[22px]">
            I have answered all common questions below that you might have about
            the course. For any further queries, please contact: <br />
            support@fozato.com
          </p>
          <div className="flex flex-col gap-4 mt-4">
            <div className="bg-[#4A4A4A] text-white p-4 rounded-2xl">
              <p className="font-bold text-[20px] text-start">
                For whom is this app?
              </p>
              <p className="text-[16px] mt-1 text-start">
                This app is for anyone who wants to optimize their YouTube
                videos automatically and improve their channel’s performance.
              </p>
            </div>

            <div className="bg-[#4A4A4A] text-white p-4 rounded-2xl">
              <p className="font-bold text-[20px] text-start">
                I made the payment but didn’t receive any update
              </p>
              <p className="text-[16px] mt-1 text-start">
                Please email us at{" "}
                <span className="font-bold">support@fozato.com</span> & our
                support team will get back to you as soon as possible.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNavigate(courseId)}
            className="bg-[#FFA41C] text-black font-bold text-[11px] md:text-lg lg:text-3xl shadow-xl 
             leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
             mb-6 w-80 md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
          >
            &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
            <span className="text-[11px] md:text-lg lg:text-xl font-semibold">
              (ONLY ₹{course.salesPrice}/3 Months)
            </span>
          </button>
          <p className="font-bold text-center lg:text-[22px] leading-tight">
            Register quickly before{" "}
            <span className="text-[#E69B2F]">the offer ends </span> to unlock
            bonuses worth <span className="text-[#E69B2F]"> ₹97,000</span>
          </p>
          <footer className="bg-black text-gray-300 text-sm mt-5 leading-relaxed text-center lg:mt-20">
            <p className="text-[8px] lg:text-[10px]">
              This site is not affiliated with YouTube™, Google™, Meta™,
              Instagram™, or Facebook™, nor is it endorsed by them in any
              manner. The term “YouTube™” is a trademark owned by Google™, Inc.,
              and “Facebook™” is a trademark owned by Meta Platforms, Inc. As
              required by law, we cannot guarantee any specific results or
              earnings from the use of our automated SEO tools, strategies, or
              services presented through Fozato SEO. Our goal is to provide
              valuable content, guidance, and strategies that have proven
              effective for ourselves and our users, and we believe can help you
              grow your YouTube channel and optimize your online presence. You
              can access all of our terms, privacy policies, and disclaimers for
              this platform through the provided links. Transparency is
              important to us, and we hold ourselves (and you) to high standards
              of integrity. Thank you for trusting Fozato SEO. We hope this app
              and our content provide you with significant value and measurable
              results.
            </p>

            <p className="mt-4 text-[8px] lg:text-[10px]">
              Note: This service is provided as part of our automated system,
              offering real-time SEO support to optimize your YouTube videos.
              Once you subscribe, you’ll be able to unlock all features for
              on-demand SEO automation and enjoy a seamless experience.
            </p>

            <p className="mt-4 text-[8px] lg:text-[10px]">
              Fozato SEO specializes in YouTube SEO and optimization tools, not
              in promoting “get rich quick” schemes or guaranteed income
              systems. We believe that with the right tools and automation,
              individuals and businesses can make informed decisions that
              improve their channel’s performance. However, we do not guarantee
              success or income results from our services. Fozato SEO does not
              make claims about specific earnings or outcomes and cannot
              guarantee that the app will generate revenue for you. All
              materials and tools provided are protected by copyright, and any
              unauthorized duplication or distribution is strictly
              prohibited.While our service focuses on improving YouTube
              performance, success depends on individual effort, time, and
              content quality. We may link to or refer content provided by third
              parties not affiliated with Fozato, SEO and we are not responsible
              for their content or services. Additionally, we may collaborate
              with or refer you to third-party businesses. Thank you for
              choosing Fozato SEO for your YouTube optimization needs.
            </p>

            <p className="cursor-pointer text-[8px] flex flex-wrap justify-center gap-2">
              <Link to="/terms" className="hover:underline">
                Terms and Conditions
              </Link>
              |
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              |
              <Link to="/refund" className="hover:underline">
                Refund/Cancellation
              </Link>
              |
              <Link to="/shipping" className="hover:underline">
                Shipping Policy
              </Link>
              |
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
              |
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SaleCourseBuyPage;
