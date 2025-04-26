import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Connection/Axios";
import ReactPixel from "react-facebook-pixel";
import { Check } from "lucide-react";
import VideoEmbed from "../../Utils/EmbeddedVideo";
import Timer from "../../Utils/Timer";

function SalesPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [salesPage, setSalesPage] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/sale/get-sales-page/course/${courseId}`
        );
        setSalesPage(response.data);
        setCourse(response.data.courseId);
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
    if (!courseId) return;
    ReactPixel.track("PageView", {
      value: course?.salesPrice,
      currency: "INR",
      content_name: "SkillXera",
      content_category: "Online Course",
      content_ids: courseId,
      content_type: "product",
    });

    navigate(`/sale/checkout-page/course/payment/${courseId}`);
  };

  const CourseCTAButton = course?.salesPrice ? (
    <button
      onClick={() => handleNavigate(courseId)}
      className="bg-[#FFA41C] md:text-lg shadow-xl 
  leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
  mb-6 w-80 md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6 text-center"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: salesPage?.buttonContent,
        }}
      />
      <span className="text-xs md:text-sm lg:text-lg font-semibold text-black">
        (ONLY ₹{course.salesPrice}/3 Months)
      </span>
    </button>
  ) : (
    <button
      className="bg-[#FFA41C] text-black font-bold text-xs md:text-lg lg:text-2xl shadow-xl 
      leading-tight py-3 px-6 md:py-4 md:px-8 lg:py-3 lg:px-10 rounded-2xl lg:rounded-3xl 
      mb-6 w-80 md:w-80 lg:w-full max-w-lg lg:max-w-4xl mt-6"
      disabled
    >
      Loading price...
    </button>
  );

  if (loading)
    return <p className="text-white text-center">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!salesPage)
    return <p className="text-white text-center">No course found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-black text-center">
      <div className="leading-tight">
        <h1 dangerouslySetInnerHTML={{ __html: salesPage?.lines?.[0] }} />

        <h2 dangerouslySetInnerHTML={{ __html: salesPage?.lines?.[1] }} />
      </div>

      <p className="mt-6">
        <span dangerouslySetInnerHTML={{ __html: salesPage?.lines?.[2] }} />
      </p>

      <span
        className="mt-6"
        dangerouslySetInnerHTML={{ __html: salesPage?.lines?.[3] }}
      />

      <p
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: salesPage?.lines?.[4] }}
      ></p>

      <div className="border-2 md:border-2 border-[#e69b2f] rounded-xl lg:rounded-xl px-4 py-2 md:px-6 md:py-3 inline-block mt-4 w-80 lg:w-2/4">
        <div dangerouslySetInnerHTML={{ __html: salesPage?.smallBoxContent }} />
      </div>

      {salesPage?.embedCode && <VideoEmbed embedCode={salesPage.embedCode} />}

      {CourseCTAButton}

      <div className="text-white lg:mt-10 text-center rounded-lg shadow-lg w-full max-w-4xl">
        <h3
          className="text-[29px] mb-10 lg:mb-10 leading-tight"
          dangerouslySetInnerHTML={{ __html: salesPage?.checkBoxHeading }}
        ></h3>

        {salesPage?.FirstCheckBox?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-10">
            {salesPage.FirstCheckBox.map((item, index) => (
              <div
                key={index}
                className="p-3 lg:p-6 border-2 border-yellow-500 rounded-3xl bg-black text-white relative flex items-start gap-3"
              >
                {/* Check Icon */}
                <div className="w-4 h-4 flex items-center justify-center bg-yellow-500 rounded-full mt-2">
                  <Check size={16} color="black" strokeWidth={3} />
                </div>

                <div>
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {CourseCTAButton}
      <div className="text-white lg:mt-10 text-center rounded-lg shadow-lg w-full max-w-4xl">
        <p>
          <div dangerouslySetInnerHTML={{ __html: salesPage?.offerContent }} />
        </p>
        <div className="bg-[#111111] h-20 lg:h-44 flex flex-col justify-center items-center text-center mt-4">
          <div
            dangerouslySetInnerHTML={{ __html: salesPage?.smallBoxContent }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: salesPage?.offerLimitingContent,
            }}
          />
        </div>

        <div className="mt-8">
          {/* Second Checkbox Heading */}
          <div
            className="text-white mb-6"
            dangerouslySetInnerHTML={{
              __html: salesPage?.secondCheckBoxHeading,
            }}
          />

          {/* Second Checkbox Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salesPage?.SecondCheckBox?.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl flex items-start text-start lg:space-x-2 shadow-md"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 border-gray-400 rounded-md mt-1"
                />
                <span
                  className="text-gray-800 lg:text-lg pl-3"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6">
        <div
          dangerouslySetInnerHTML={{
            __html: salesPage.SecondCheckBoxConcluding,
          }}
        />
      </p>

      <p className="mt-2 lg:mt-7 text-white font-bold text-lg text-center text-[25px] lg:text-[45px] lg:whitespace-nowrap lg:flex justify-center">
        <div dangerouslySetInnerHTML={{ __html: salesPage.Topic }} />
      </p>

      {CourseCTAButton}

      <p>
        <div dangerouslySetInnerHTML={{ __html: salesPage?.offerContent }} />
      </p>

      {/* New Content Below */}

      {/* <div className="mt-5 text-center text-white "> */}
      <div
        className="text-2xl font-bold lg:text-[42px] lg:mt-20"
        dangerouslySetInnerHTML={{
          __html: salesPage?.ThirdSectionSubHeading,
        }}
      />

      {salesPage?.ThirdSectionDescription?.map((desc, index) => (
        <p
          key={index}
          className={`${
            index === 0 ? "mt-4 lg:mt-10" : "mt-8"
          } text-[#9b9b9b] font-semibold text-[16px] leading-tight lg:font-normal lg:text-[29px]`}
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      ))}

      <p className="mt-2 lg:mt-7 text-yellow-500 font-bold text-lg text-center text-[25px] lg:text-[45px] lg:whitespace-nowrap lg:flex justify-center">
        <div dangerouslySetInnerHTML={{ __html: salesPage.Topic }} />
      </p>

      {/* Image Section */}
      <div className="flex justify-center mt-6 bg-white rounded-2xl lg:rounded">
        <img
          src={`${BASE_URL}/uploads/${salesPage?.mainImage}`}
          alt="Fozato SEO - YouTube Auto SEO App"
          className="w-full lg:max-w-6xl lg:max-h-[500px] rounded-lg shadow-lg"
        />
      </div>
      {CourseCTAButton}

      <div className="lg:mt-10 text-white bg-[#111111] p-6">
        <div className="text-white lg:mt-10 text-center rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <div className="grid gap-6 text-white lg:text-[20px] grid-cols-1 md:grid-cols-2">
            {salesPage?.AfterButtonPoints?.description?.map((point, index) => {
              // If there's an odd number of points, make the last one span full width
              const isLastOdd =
                salesPage?.AfterButtonPoints?.description?.length % 2 !== 0 &&
                index === salesPage?.AfterButtonPoints?.description?.length - 1;

              return (
                <div
                  key={index}
                  className={`flex items-start mt-4 md:mt-0 ${
                    isLastOdd ? "md:col-span-2 justify-center" : ""
                  }`}
                >
                  <div className="w-6 h-5 flex items-center justify-center bg-yellow-500 rounded mt-1 shrink-0">
                    <Check size={20} color="black" strokeWidth={3} />
                  </div>
                  <div
                    className="ml-2 text-start font-bold"
                    dangerouslySetInnerHTML={{ __html: point }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <h1 className="mt-6 font-bold text-white text-[22px]">BONUSES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {salesPage?.bonusImages?.map((bonus, index) => (
          <div
            key={bonus._id}
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
                src={`${BASE_URL}/uploads/${bonus.image}`}
                alt={bonus.title}
                className="w-full max-w-[250px] rounded-lg"
              />
            </div>

            {/* Title */}
            <h3 className="text-center mt-4 font-bold text-lg text-[#34495E]">
              {bonus.title}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-2 rounded-3xl shadow-lg w-full max-w-4xl mx-auto text-center">
        <div className="text-center text-white">
          <h2
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[0] }}
          />

          <p
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[1] }}
          />

          <p
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[2] }}
          />

          <p
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[3] }}
          />

          <p
            className="mt-2 lg:mt-10"
            dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[4] }}
          />
        </div>

        <Timer />

        <p>
          <div dangerouslySetInnerHTML={{ __html: salesPage?.offerContent }} />
        </p>
        <p
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: salesPage?.section5Lines[5] }}
        />

        {CourseCTAButton}
      </div>

      <p>
        <div dangerouslySetInnerHTML={{ __html: salesPage?.offerContent }} />
      </p>

      <h1 className="mt-10">
        <div dangerouslySetInnerHTML={{ __html: salesPage?.lastPartHeading }} />
      </h1>
      <p className="mt-6">
        <div dangerouslySetInnerHTML={{ __html: salesPage?.lastPartContent }} />
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {salesPage?.faq?.map((item, index) => (
          <div
            key={item._id || index}
            className="bg-[#4A4A4A] text-white p-4 rounded-2xl"
          >
            <p className="font-bold text-[20px] text-start">{item.question}</p>
            <div
              className="text-[16px] mt-1 text-start"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        ))}
      </div>

      {CourseCTAButton}
      <p>
        <div dangerouslySetInnerHTML={{ __html: salesPage?.offerContent }} />
      </p>
      <footer className="bg-black text-gray-300 text-sm mt-5 leading-relaxed text-center lg:mt-20">
        <p className="text-[8px] lg:text-[10px]">
          This site is not affiliated with YouTube™, Google™, Meta™, Instagram™,
          or Facebook™, nor is it endorsed by them in any manner. The term
          “YouTube™” is a trademark owned by Google™, Inc., and “Facebook™” is a
          trademark owned by Meta Platforms, Inc. As required by law, we cannot
          guarantee any specific results or earnings from the use of our
          automated SEO tools, strategies, or services presented through Fozato
          SEO. Our goal is to provide valuable content, guidance, and strategies
          that have proven effective for ourselves and our users, and we believe
          can help you grow your YouTube channel and optimize your online
          presence. You can access all of our terms, privacy policies, and
          disclaimers for this platform through the provided links. Transparency
          is important to us, and we hold ourselves (and you) to high standards
          of integrity. Thank you for trusting Fozato SEO. We hope this app and
          our content provide you with significant value and measurable results.
        </p>

        <p className="mt-4 text-[8px] lg:text-[10px]">
          Note: This service is provided as part of our automated system,
          offering real-time SEO support to optimize your YouTube videos. Once
          you subscribe, you’ll be able to unlock all features for on-demand SEO
          automation and enjoy a seamless experience.
        </p>

        <p className="mt-4 text-[8px] lg:text-[10px]">
          Fozato SEO specializes in YouTube SEO and optimization tools, not in
          promoting “get rich quick” schemes or guaranteed income systems. We
          believe that with the right tools and automation, individuals and
          businesses can make informed decisions that improve their channel’s
          performance. However, we do not guarantee success or income results
          from our services. Fozato SEO does not make claims about specific
          earnings or outcomes and cannot guarantee that the app will generate
          revenue for you. All materials and tools provided are protected by
          copyright, and any unauthorized duplication or distribution is
          strictly prohibited.While our service focuses on improving YouTube
          performance, success depends on individual effort, time, and content
          quality. We may link to or refer content provided by third parties not
          affiliated with Fozato, SEO and we are not responsible for their
          content or services. Additionally, we may collaborate with or refer
          you to third-party businesses. Thank you for choosing Fozato SEO for
          your YouTube optimization needs.
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
  );
}

export default SalesPage;
