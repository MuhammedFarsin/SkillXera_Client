import { useEffect } from "react";

const VidalyticsPlayer = () => {
  useEffect(() => {
    console.log("Loading Vidalytics script...");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://fast.vidalytics.com/embeds/7WfizetF/fq0lHOnhLvlEaDZP/loader.min.js";

    script.onload = () => {
      console.log("Vidalytics loader script loaded!");

      const playerScript = document.createElement("script");
      playerScript.type = "text/javascript";
      playerScript.async = true;
      playerScript.src = "https://fast.vidalytics.com/embeds/7WfizetF/fq0lHOnhLvlEaDZP/player.min.js";

      playerScript.onload = () => {
        console.log("Vidalytics player script loaded!");
      };

      document.body.appendChild(playerScript);
    };

    document.body.appendChild(script);

    return () => {
      console.log("Cleaning up Vidalytics scripts...");
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="vidalytics_embed_fq0lHOnhLvlEaDZP" style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}>
      <p>Loading video...</p>
    </div>
  );
};

export default VidalyticsPlayer;
