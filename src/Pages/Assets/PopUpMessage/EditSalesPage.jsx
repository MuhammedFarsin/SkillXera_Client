import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TiptapEditor from "../../../Utils/TiptapEditor";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import ToastHot from "../../Common/ToasterHot";

function EditSalesPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const baseURL = axiosInstance.defaults.baseURL;
  const [formData, setFormData] = useState({
    mainImage: null,
    mainImagePreview: "",
    bonusImages: [], // New files to upload
    existingBonusImages: [], // Existing images from server
    bonusTitles: [], // For bonus image titles
    lines: [], // Initialize empty, will be filled from API
    section5Lines: [], // Initialize empty
    embedCode: "",
    smallBoxContent: "",
    buttonContent: "",
    checkBoxHeading: "",
    FirstCheckBox: [],
    secondCheckBoxHeading: "",
    SecondCheckBox: [],
    Topic: "",
    ThirdSectionSubHeading: "",
    ThirdSectionDescription: [],
    AfterButtonPoints: { description: [] },
    offerContent: "",
    offerLimitingContent: "",
    SecondCheckBoxConcluding: "",
    lastPartHeading: "",
    lastPartContent: "",
    faq: []
  });
  
  // In your useEffect when fetching data:
  useEffect(() => {
    const fetchSalesPageDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/assets/course/get-sales-page/${courseId}`
        );

  
        if (response.status === 200) {
          console.log(response.data)
          const data = response.data;
          
          setFormData({
            mainImage: null,
            mainImagePreview: data.mainImage ? `${baseURL}/uploads/${data.mainImage}` : "",
            bonusImages: [],
            existingBonusImages: data.bonusImages || [],
            bonusTitles: data.bonusImages?.map(img => img.title) || [],
            lines: data.lines || [],
            section5Lines: data.section5Lines || [],
            embedCode: data.embedCode || "",
            smallBoxContent: data.smallBoxContent || "",
            buttonContent: data.buttonContent || "",
            checkBoxHeading: data.checkBoxHeading || "",
            FirstCheckBox: data.FirstCheckBox || [],
            secondCheckBoxHeading: data.secondCheckBoxHeading || "",
            SecondCheckBox: data.SecondCheckBox || [],
            Topic: data.Topic || "",
            ThirdSectionSubHeading: data.ThirdSectionSubHeading || "",
            ThirdSectionDescription: data.ThirdSectionDescription || [],
            AfterButtonPoints: data.AfterButtonPoints || { description: [] },
            offerContent: data.offerContent || "",
            offerLimitingContent: data.offerLimitingContent || "",
            SecondCheckBoxConcluding: data.SecondCheckBoxConcluding || "",
            lastPartHeading: data.lastPartHeading || "",
            lastPartContent: data.lastPartContent || "",
            faq: data.faq || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch sales page details:", error);
        toast.error("Failed to load sales page data");
      }
    };
  
    fetchSalesPageDetails();
  }, [courseId, baseURL]);


  // Handler functions (similar to AddSales_page but adjusted for edit functionality)
  const handleLineChange = (index, value) => {
    const updatedLines = [...formData.lines];
    updatedLines[index] = value;
    setFormData(prev => ({ ...prev, lines: updatedLines }));
  };

  const addNewLine = () => {
    setFormData(prev => ({ ...prev, lines: [...prev.lines, ""] }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleBonusImagesChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...formData.bonusImages];
    updated[index] = { file, title: formData.bonusTitles[index] || "" };
    
    setFormData(prev => ({ ...prev, bonusImages: updated }));
  };

  const handleBonusTitleChange = (index, title) => {
    const updatedTitles = [...formData.bonusTitles];
    updatedTitles[index] = title;
    
    setFormData(prev => ({ ...prev, bonusTitles: updatedTitles }));
  };

  const handleAddBonusImage = () => {
    setFormData(prev => ({
      ...prev,
      bonusImages: [...prev.bonusImages, { file: null, title: "" }],
      bonusTitles: [...prev.bonusTitles, ""]
    }));
  };

  const handleSection5LineChange = (index, value) => {
    const updatedLines = [...formData.section5Lines];
    updatedLines[index] = value;
    setFormData(prev => ({ ...prev, section5Lines: updatedLines }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaq = [...formData.faq];
    updatedFaq[index][field] = value;
    setFormData(prev => ({ ...prev, faq: updatedFaq }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }]
    }));
  };

  const removeFaq = (index) => {
    const updatedFaq = formData.faq.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, faq: updatedFaq }));
  };

  const addNewSection5Line = () => {
    setFormData(prev => ({
      ...prev,
      section5Lines: [...prev.section5Lines, ""]
    }));
  };

  const handleFirstCheckboxChange = (index, value) => {
    const updatedCheckBoxes = [...formData.FirstCheckBox];
    updatedCheckBoxes[index].description = value;
    setFormData(prev => ({ ...prev, FirstCheckBox: updatedCheckBoxes }));
  };

  const addCheckBox = () => {
    setFormData(prev => ({
      ...prev,
      FirstCheckBox: [...prev.FirstCheckBox, { description: "" }]
    }));
  };

  const handleEmbedCodeChange = (e) => {
    setFormData(prev => ({ ...prev, embedCode: e.target.value }));
  };

  const handleSecondCheckboxChange = (index, value) => {
    const updated = [...formData.SecondCheckBox];
    updated[index].description = value;
    setFormData(prev => ({ ...prev, SecondCheckBox: updated }));
  };

  const addSecondCheckBox = () => {
    setFormData(prev => ({
      ...prev,
      SecondCheckBox: [...prev.SecondCheckBox, { description: "" }]
    }));
  };

  const handleThirdDescriptionChange = (index, value) => {
    const updated = [...formData.ThirdSectionDescription];
    updated[index] = value;
    setFormData(prev => ({ ...prev, ThirdSectionDescription: updated }));
  };

  const addThirdDescription = () => {
    setFormData(prev => ({
      ...prev,
      ThirdSectionDescription: [...prev.ThirdSectionDescription, ""]
    }));
  };

  const handleAfterButtonPointChange = (index, value) => {
    const updated = [...formData.AfterButtonPoints.description];
    updated[index] = value;
    setFormData(prev => ({
      ...prev,
      AfterButtonPoints: { description: updated }
    }));
  };

  const addAfterButtonPoint = () => {
    setFormData(prev => ({
      ...prev,
      AfterButtonPoints: {
        description: [...prev.AfterButtonPoints.description, ""]
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();
      
      // Append main image if changed
      if (formData.mainImage) {
        submissionData.append("mainImage", formData.mainImage);
      }

      // Append bonus images and titles
      formData.bonusImages.forEach((bonus, i) => {
        if (bonus.file) {
          submissionData.append("bonusImages", bonus.file);
          submissionData.append(`bonusTitles[${i}]`, bonus.title || "");
        }
      });

      // Append existing bonus titles for images not being changed
      formData.existingBonusImages.forEach((img, i) => {
        if (!formData.bonusImages[i]?.file) {
          submissionData.append(`bonusTitles[${i}]`, formData.bonusTitles[i] || "");
        }
      });

      // Append all other fields
      formData.lines.forEach((line, i) => {
        submissionData.append(`lines[${i}]`, line);
      });

      submissionData.append("smallBoxContent", formData.smallBoxContent);
      submissionData.append("buttonContent", formData.buttonContent);
      submissionData.append("checkBoxHeading", formData.checkBoxHeading);

      formData.FirstCheckBox.forEach((item, i) => {
        submissionData.append(
          `FirstCheckBox[${i}][description]`,
          item.description
        );
      });

      submissionData.append(
        "secondCheckBoxHeading",
        formData.secondCheckBoxHeading
      );
      submissionData.append("Topic", formData.Topic);
      submissionData.append(
        "ThirdSectionSubHeading",
        formData.ThirdSectionSubHeading
      );
      submissionData.append("embedCode", formData.embedCode);
      submissionData.append("offerContent", formData.offerContent);
      submissionData.append(
        "offerLimitingContent",
        formData.offerLimitingContent
      );
      submissionData.append(
        "SecondCheckBoxConcluding",
        formData.SecondCheckBoxConcluding
      );
      submissionData.append("lastPartHeading", formData.lastPartHeading);
      submissionData.append("lastPartContent", formData.lastPartContent);

      formData.ThirdSectionDescription.forEach((desc, i) => {
        submissionData.append(`ThirdSectionDescription[${i}]`, desc);
      });

      formData.AfterButtonPoints.description.forEach((point, i) => {
        submissionData.append(`AfterButtonPoints[${i}]`, point);
      });

      formData.section5Lines.forEach((line, i) => {
        submissionData.append(`section5Lines[${i}]`, line);
      });

      formData.faq.forEach((item, i) => {
        submissionData.append(`faq[${i}][question]`, item.question);
        submissionData.append(`faq[${i}][answer]`, item.answer);
      });

      const response = await axiosInstance.put(
        `/admin/assets/course/update-sales-page/${courseId}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sales page updated successfully.");
        setTimeout(() => {
          navigate("/admin/assets/courses");
        }, 2000);
        setIsUpdated(true);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update sales page.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  console.log("Current smallBoxContent:", formData.smallBoxContent);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Sales Page</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 1</h2>

          {formData.lines.map((line, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                Line {index + 1}
              </label>
              <TiptapEditor
                value={line}
                onChange={(value) => handleLineChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addNewLine}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Line
          </button>

          <div>
            <label className="block text-gray-300 mb-2">
              Small Box Content
            </label>
            <TiptapEditor
              value={formData.smallBoxContent}
              onChange={(value) =>
                setFormData({ ...formData, smallBoxContent: value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Embed Code</label>
            <textarea
              value={formData.embedCode}
              onChange={handleEmbedCodeChange}
              rows="4"
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Paste the embed code here"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Button Content</label>
            <TiptapEditor
              value={formData.buttonContent}
              onChange={(value) =>
                setFormData({ ...formData, buttonContent: value })
              }
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 2</h2>
          <div>
            <label className="block text-gray-300 mb-2">Checkbox Heading</label>
            <TiptapEditor
              value={formData.checkBoxHeading}
              onChange={(value) =>
                setFormData({ ...formData, checkBoxHeading: value })
              }
            />
          </div>

          {formData.FirstCheckBox.map((item, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                Description {index + 1}
              </label>
              <TiptapEditor
                value={item.description}
                onChange={(value) => handleFirstCheckboxChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addCheckBox}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Check Box
          </button>
        </div>

        {/* Section 3 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 3</h2>

          <div>
            <label className="block text-gray-300 mb-2">Offer Content</label>
            <TiptapEditor
              value={formData.offerContent}
              onChange={(value) =>
                setFormData({ ...formData, offerContent: value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Offer Limiting Content
            </label>
            <TiptapEditor
              value={formData.offerLimitingContent}
              onChange={(value) =>
                setFormData({ ...formData, offerLimitingContent: value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Second Checkbox Heading
            </label>
            <TiptapEditor
              value={formData.secondCheckBoxHeading}
              onChange={(value) =>
                setFormData({ ...formData, secondCheckBoxHeading: value })
              }
            />
          </div>

          {formData.SecondCheckBox.map((item, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                Second Checkbox Description {index + 1}
              </label>
              <TiptapEditor
                value={item.description}
                onChange={(value) => handleSecondCheckboxChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSecondCheckBox}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Second Check Box
          </button>

          <div>
            <label className="block text-gray-300 mb-2">
              Check Box Concluding words
            </label>
            <TiptapEditor
              value={formData.SecondCheckBoxConcluding}
              onChange={(value) =>
                setFormData({ ...formData, SecondCheckBoxConcluding: value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Topic</label>
            <input
              type="text"
              name="Topic"
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={formData.Topic}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 4</h2>

          <div>
            <label className="block text-gray-300 mb-2">
              Fourth Section Subheading
            </label>
            <input
              type="text"
              name="ThirdSectionSubHeading"
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={formData.ThirdSectionSubHeading}
              onChange={handleInputChange}
            />
          </div>

          {formData.ThirdSectionDescription.map((desc, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                Third Description {index + 1}
              </label>
              <TiptapEditor
                value={desc}
                onChange={(value) => handleThirdDescriptionChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addThirdDescription}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Third Description
          </button>

          <div>
            <label className="block text-gray-300 mb-2">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="text-white"
            />
            {formData.mainImagePreview && (
              <img
                src={formData.mainImagePreview}
                alt="Main Preview"
                className="mt-4 rounded-md max-w-xs border border-gray-700"
              />
            )}
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 5</h2>

          {formData.AfterButtonPoints.description.map((point, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                After Button Point {index + 1}
              </label>
              <TiptapEditor
                value={point}
                onChange={(value) => handleAfterButtonPointChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addAfterButtonPoint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add After Button Point
          </button>

          <div className="space-y-6">
            <label className="block text-gray-300">Bonus Images</label>

            {/* Existing bonus images */}
            {formData.existingBonusImages.map((img, index) => (
              <div key={`existing-${index}`} className="space-y-2">
                <img
                  src={`${baseURL}/uploads/${img.image}`}
                  alt={`Bonus ${index + 1}`}
                  className="rounded-md max-w-xs border border-gray-700"
                />
                <input
                  type="text"
                  placeholder={`Title for bonus image ${index + 1}`}
                  value={formData.bonusTitles[index] || ""}
                  onChange={(e) => handleBonusTitleChange(index, e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
            ))}

            {/* New bonus images */}
            {formData.bonusImages.map((bonus, index) => (
              <div key={`new-${index}`} className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBonusImagesChange(e, index)}
                  className="text-white block"
                />
                {bonus.file && (
                  <img
                    src={URL.createObjectURL(bonus.file)}
                    alt={`Bonus Preview ${index + 1}`}
                    className="rounded-md max-w-xs border border-gray-700"
                  />
                )}
                <input
                  type="text"
                  placeholder={`Title for bonus image ${index + 1}`}
                  value={bonus.title || ""}
                  onChange={(e) =>
                    handleBonusTitleChange(index, e.target.value)
                  }
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddBonusImage}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Bonus Image
            </button>
          </div>

          {formData.section5Lines.map((line, index) => (
            <div key={index}>
              <label className="block text-gray-300 mb-2">
                Line {index + 1}
              </label>
              <TiptapEditor
                value={line}
                onChange={(value) => handleSection5LineChange(index, value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addNewSection5Line}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Line
          </button>
        </div>

        {/* Section 6 */}
        <div className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-900 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Section 6</h2>

          <div>
            <label className="block text-gray-300 mb-2">
              Last Part Heading
            </label>
            <input
              type="text"
              name="lastPartHeading"
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={formData.lastPartHeading}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Last Part Content
            </label>
            <TiptapEditor
              value={formData.lastPartContent}
              onChange={(value) =>
                setFormData({ ...formData, lastPartContent: value })
              }
            />
          </div>

          <div>
            <h3 className="text-lg text-white font-semibold mt-6 mb-4">FAQs</h3>
            {formData.faq.map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-md space-y-3"
              >
                <div>
                  <label className="block text-gray-300 mb-1">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    placeholder="Enter the question"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Answer</label>
                  <TiptapEditor
                    value={item.answer}
                    onChange={(value) =>
                      handleFaqChange(index, "answer", value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              + Add FAQ
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          {!isUpdated ? (
            <>
              <button
                type="submit"
                className="bg-gradient-to-b from-gray-800 to-teal-500 text-white px-4 py-2 rounded-md hover:from-gray-700 hover:to-teal-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Sales Page"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </form>
      <ToastHot />
    </div>
  );
}

export default EditSalesPage;