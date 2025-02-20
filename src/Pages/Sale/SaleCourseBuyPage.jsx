import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Connection/Axios";

function SaleCourseBuyPage() {
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

  if (loading)
    return <p className="text-white text-center">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!course) return <p className="text-white text-center">No course found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-center">
      <h1 className="text-3xl font-bold text-white mb-4">
        Experience the Power of
      </h1>
      <h2 className="text-4xl font-extrabold text-red-600">
        &quot;AUTOMATED YOUTUBE SEO WITH FOZATO SEO&quot;
      </h2>
      <p className="text-lg text-gray-300 mt-4">
        <span className="font-bold text-blue-400">
          &quot;DOUBLE YOUR YOUTUBE VIEWS & REVENUE&quot;
        </span>{" "}
        with Our Revolutionary YouTube SEO App, by Performing YouTube SEO
        Automatically!
      </p>
      <p className="mt-2 text-gray-400">
        (Join 5857+ satisfied users who have optimized their YouTube videos
        using Fozato SEO)
      </p>
      <p className="mt-2 text-gray-400">
        (Even if you’ve never done SEO for YouTube videos before)
      </p>
      <div className="mt-6">
        <span className="px-4 py-2 bg-green-500 text-white rounded-lg text-lg font-semibold shadow-md">
          Rank Higher | Reach more viewers | Get more Revenue
        </span>
      </div>
      <p className="mt-6 text-xl font-bold text-white">
        Fozato SEO: The World&apos;s First Most Powerful YouTube Ranking System
      </p>

      {/* Render the fetched video with autoplay */}
      {course.video && (
        <div className="mt-8 w-full max-w-2xl">
          <iframe
            width="100%"
            height="400"
            src={`${BASE_URL}${course.video}?autoplay=1&mute=1`}
            title="Course Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      )}

      {/* After Video Content */}
      <div className=" text-white text-center rounded-lg shadow-lg w-full max-w-3xl">
        <button className="bg-yellow-500 text-black font-bold text-lg py-3 px-6 rounded-md mb-6">
          &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
          <span className="text-sm">(ONLY ₹1999/3 Months)</span>
        </button>

        <h3 className="text-2xl font-bold mb-4">
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
              className="p-4 border border-yellow-500 rounded-md"
            >
              <h4 className="font-bold text-yellow-400">{item.title}:</h4>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>

        <button className="bg-yellow-500 text-black font-bold text-lg py-3 px-6 rounded-md mt-6">
          &gt;&gt; YES, I WANT TO AUTOMATE MY YOUTUBE SEO <br />
          <span className="text-sm">(ONLY ₹1999/3 Months)</span>
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

        <div className="mt-6 bg-black text-white p-6 rounded-lg">
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
            <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg">
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
              <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg">
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
      <span className="ml-2 font-bold text-yellow-400">
        Stop Waiting and{" "}
        <span className="text-orange-500">
          Start Optimising Your YouTube Videos
        </span>{" "}
        in Less Than 3 Minutes ~ GUARANTEED!
      </span>
    </p>

    <p className="flex items-start mt-4">
      <span className="text-green-500 text-xl">✅</span>
      <span className="ml-2 font-bold text-yellow-400">
        Craft Seamless{" "}
        <span className="text-orange-500">Sales Pitches:</span>
      </span>
      <span className="ml-1"> Tailored to your industry and business needs.</span>
    </p>

    <p className="flex items-start mt-4">
      <span className="text-green-500 text-xl">✅</span>
      <span className="ml-2 font-bold text-orange-500">
        No More Reliance on Outdated Sales Tactics:
      </span>
      <span className="ml-1"> Embrace the power of modern sales strategies.</span>
    </p>
  </div>

  {/* Right Side */}
  <div>
    <p className="flex items-start">
      <span className="text-green-500 text-xl">✅</span>
      <span className="ml-2 font-bold text-yellow-400">
        Step-by-Step <span className="text-orange-500">Automated SEO</span> to Optimize Your YouTube Videos & Boost Channel&apos;s Growth
      </span>
    </p>

    <p className="flex items-start mt-4">
      <span className="text-green-500 text-xl">✅</span>
      <span className="ml-2 font-bold text-yellow-400">
        Learn to <span className="text-orange-500">Leverage Tools for YouTube SEO</span> and Experience Freedom from Tedious Tasks
      </span>
    </p>

    <p className="flex items-start mt-4">
      <span className="text-green-500 text-xl">✅</span>
      <span className="ml-2 font-bold text-yellow-400">
        Witness a <span className="text-orange-500">Boost in Your Revenue</span> with High-Ranking SEO-Optimized Videos
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
