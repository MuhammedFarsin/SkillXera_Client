import { useRef, useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme
import { format } from "date-fns";

// eslint-disable-next-line react/prop-types
const DateRange_Picker = ({ showPicker, setShowPicker, setDateRange }) => {
    const pickerRef = useRef(null);
    const [range, setRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
          setShowPicker(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setShowPicker]);
  
    if (!showPicker) return null;
  
    return (
      <div
        ref={pickerRef}
        className="absolute top-14 right-0 bg-white p-4 shadow-lg rounded-lg z-50 border border-gray-200"
      >
        <DateRange
          ranges={range}
          onChange={(item) => setRange([item.selection])}
          showMonthAndYearPickers={true}
          editableDateInputs={true}
          moveRangeOnFirstSelection={false}
          rangeColors={["#3b82f6"]}
        />
  
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-700 text-sm">
            {format(range[0].startDate, "MMM dd, yyyy")} -{" "}
            {format(range[0].endDate, "MMM dd, yyyy")}
          </span>
          <div className="flex gap-2">
            <button
              className="bg-gray-400 text-white px-4 py-1 rounded-lg text-sm"
              onClick={() => {
                setRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
                setDateRange({ startDate: null, endDate: null }); // Reset date range
                setShowPicker(false); // Close the picker
              }}
            >
              Clear
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
              onClick={() => {
                setDateRange({
                  startDate: range[0].startDate,
                  endDate: range[0].endDate,
                }); // Update parent state
                setShowPicker(false); // Close the picker
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

export default DateRange_Picker;
