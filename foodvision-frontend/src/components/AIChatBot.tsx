"use client";

import { useEffect } from "react";

export default function AIChatBot() {
  useEffect(() => {
    // Check if the script is already loaded
    if (document.querySelector('script[data-preny-bot-id]')) return;

    const script = document.createElement("script");
    script.src = "https://app.preny.ai/embed-global.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-title", "FoodVision AI");
    script.setAttribute("data-button-style", "width:200px;height:200px;");
    script.setAttribute("data-language", "vi");
    script.setAttribute("data-preny-bot-id", "695d289b4738b6de2b2f7808");

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[data-preny-bot-id]');
      if (existingScript) existingScript.remove();
      // Also remove the bot container if Preny injects one
      const botContainer = document.querySelector('[data-preny-bot-id]');
      if (botContainer) botContainer.remove();
    };
  }, []);

  return null; // Preny injects its own UI
}
