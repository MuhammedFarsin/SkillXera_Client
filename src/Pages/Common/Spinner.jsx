// Spinner.jsx
// eslint-disable-next-line react/prop-types
function Spinner({ small }) {
    const size = small ? "w-4 h-4 border-2" : "w-12 h-12 border-4";
  
    return (
      <div className={`border-white border-dashed rounded-full animate-spin ${size}`}></div>
    );
  }
  
  export default Spinner;
  