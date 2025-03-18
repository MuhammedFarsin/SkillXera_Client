import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    ReactPixel.track("Purchase", {
      value: course.price,
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-center">
      <h1 className="text-[50px] font-bold text-[#e69b2f] leading-[40px] mb-4">
        Experience the <span className="text-white"> Power of </span>
      </h1>

      <h2 className="text-[37px] font-extrabold text-[#e69b2f] leading-[40px]">
        &quot;AUTOMATED YOUTUBE SEO WITH FOZATO SEO&quot;
      </h2>
      <p className="text-lg text-gray-300 mt-4">
        <span className="text-[27px] font-extrabold text-[#e69b2f] leading-[27px]">
          &quot;DOUBLE YOUR YOUTUBE VIEWS & REVENUE&quot;{" "}
          <span className="text-white"> with Our Revolutionary</span>
        </span>{" "}
      </p>
      <span className="text-white text-[27px] font-bold leading-[30px]">
        YouTube SEO App, by Performing YouTube SEO Automatically!
      </span>

      <span className="text-start">
        with Our Revolutionary YouTube SEO App, by Performing YouTube SEO
        Automatically!
      </span>
      <p className="mt-2 text-[#9b9b9b] text-[22px] leading-[30px] font-semibold">
        (Join 5857+ satisfied users who have optimized <br />
        <span className="font-semibold">
          their YouTube videos using Fozato SEO)
        </span>
      </p>

      <p className="mt-2 text-gray-400 text-[19px] font-semibold">
        (Even if you’ve never done SEO for YouTube videos before)
      </p>
      <div className="mt-6">
        <span className="px-4 py-2 text-[20px] text-[#e69b2f] leading-[25px] font-normal font-[Poppins]">
          Rank Higher | Reach more viewers | Get more Revenue
        </span>
      </div>
      <div className="border-4 border-[#e69b2f] rounded-2xl px-6 py-3 inline-block mt-6">
        <p className="text-white text-lg font-bold">
          <span className="text-[#ffffff]">fozato SEO:</span>
          <span className="text-[#e69b2f]">
            {" "}
            The World’s First Most Powerful YouTube Ranking System
          </span>
        </p>
      </div>

      <div className="w-3/4 mt-6 ">
        <VidalyticsPlayer />
      </div>

      {/* After Video Content */}
      <button
        onClick={() => handleNavigate(courseId)}
        className="bg-[#FFA41C] text-black font-bold text-[30px] leading-[42px] py-3 px-6 rounded-2xl mb-6 w-full max-w-4xl"
      >
        &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
        <span className="text-[20px] font-medium">
          (ONLY ₹{course.salesPrice}/3 Months)
        </span>
      </button>
      <div className="text-white mt-10 text-center rounded-lg shadow-lg w-full max-w-4xl">
        <h3 className="text-[29px] font-bold mb-10 ">
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
              className="p-6 border-4 border-yellow-500 rounded-2xl bg-black text-white relative flex items-start gap-3"
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
          className="bg-[#FFA41C] text-black font-bold text-[30px] leading-[42px] py-3 px-6 rounded-2xl mb-6 mt-6 w-full"
        >
          &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
          <span className="text-[20px] font-medium">
            (ONLY ₹{course.salesPrice}/3 Months)
          </span>
        </button>

        <p className="mt-4 text-gray-300 font-semibold">
          Register quickly before the offer ends to unlock bonuses worth ₹97,000
        </p>

        <p className="mt-6 font-bold text-yellow-400">Fozato SEO:</p>
        <p className="text-yellow-300">
          The World&apos;s First Most Powerful YouTube Ranking System
        </p>
        <p className="text-red-500 font-bold mt-2">
          ***Hurry! Limited spots available for this offer!***
        </p>

        <div className="mt-6 text-white p-6 rounded-lg">
          <p className="font-bold text-yellow-400 text-center">
            Please Check All Boxes Where Your Answer Is{" "}
            <span className="text-yellow-500">YES!</span>
          </p>

          <div className="mt-4 space-y-3">
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
                className="bg-white p-4 rounded-lg flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  className="form-checkbox text-yellow-400 w-5 h-5"
                />
                <span className="text-black text-center">{text}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-white font-semibold text-center">
            If You Checked <span className="text-yellow-400">ANY</span> Of The
            Boxes Above, Then You’re Invited To Use The
          </p>

          <p className="mt-2 text-white font-bold text-lg text-center">
            “FOZATO SEO YOUTUBE AUTO SEO APP”
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleNavigate}
              className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg"
            >
              &raquo; YES, I WANT TO AUTOMATE MY YOUTUBE SEO (ONLY ₹1999/3
              Months)
            </button>
          </div>

          <p className="mt-4 text-red-400 font-bold text-center">
            Register quickly before the offer ends to unlock bonuses worth
            ₹97,000
          </p>

          {/* New Content Below */}

          <div className="mt-10 text-center text-white">
            <h2 className="text-2xl font-bold">
              Unlock Your Potential in{" "}
              <span className="text-yellow-400">YouTube SEO Today!</span>
            </h2>
            <p className="mt-2 text-gray-300">
              With the right guidance and access to{" "}
              <span className="text-blue-400 underline">
                cutting-edge tools
              </span>
              , you can rank your videos higher and grow your channel
              effortlessly!
            </p>

            <p className="mt-4 text-gray-300">
              Whether you’re a complete novice with zero SEO experience <br />
              And have never attempted YouTube optimization before... <br />
              You need an Automated System that will do SEO for you.
            </p>

            <p className="mt-4 text-gray-300 font-semibold">
              And That’s Exactly What You Will Experience In This
            </p>

            <h3 className="mt-2 text-yellow-400 font-bold text-lg">
              “fozato SEO –{" "}
              <span className="text-yellow-500">YouTube Auto SEO App”</span>
            </h3>

            {/* Image Section */}
            <div className="flex justify-center mt-6">
              <img
                src={`${BASE_URL}${course.images[0]}`}
                alt="Fozato SEO - YouTube Auto SEO App"
                className="w-full max-w-3xl rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNavigate}
                className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                &raquo; YES, I WANT TO AUTOMATE MY YOUTUBE SEO (ONLY ₹1999/3
                Months)
              </button>
            </div>
            <div className="mt-10 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                {/* Left Side */}
                <div>
                  <p className="flex items-start">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2 text-start font-bold text-yellow-400">
                      Stop Waiting and{" "}
                      <span className="text-orange-500">
                        Start Optimising Your YouTube Videos
                      </span>{" "}
                      in Less Than 3 Minutes ~ GUARANTEED!
                    </span>
                  </p>

                  <p className="flex items-start mt-4">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2 text-start font-bold text-yellow-400">
                      Craft Seamless{" "}
                      <span className="text-orange-500 text-end">
                        Sales Pitches:
                      </span>
                      <span className="text-start text-white">
                        {" "}
                        Tailored to your industry and business needs.
                      </span>
                    </span>
                  </p>

                  <p className="flex items-start mt-4">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2 text-start font-bold text-orange-500">
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
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2  text-start font-bold text-orange-500">
                      Step-by-Step{" "}
                      <span className="text-orange-500">Automated SEO </span>
                      <span className="font-bold text-white">
                        to Optimize Your YouTube Videos & Boost Channel&apos;s
                        Growth
                      </span>
                    </span>
                  </p>

                  <p className="flex items-start mt-4">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2 text-start font-bold text-white">
                      Learn to{" "}
                      <span className="text-orange-500">
                        Leverage Tools for YouTube SEO
                      </span>{" "}
                      and Experience Freedom from Tedious Tasks
                    </span>
                  </p>

                  <p className="flex items-start mt-4">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="ml-2 text-start font-bold text-white">
                      Witness a{" "}
                      <span className="text-orange-500">
                        Boost in Your Revenue
                      </span>{" "}
                      with High-Ranking SEO-Optimized Videos
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleCourseBuyPage;
