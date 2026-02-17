
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { structuredData, organizationData } from "./seo-config.ts";

// Add structured data to document head for SEO
const addStructuredData = () => {
  const script1 = document.createElement('script');
  script1.type = 'application/ld+json';
  script1.text = JSON.stringify(structuredData);
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.type = 'application/ld+json';
  script2.text = JSON.stringify(organizationData);
  document.head.appendChild(script2);
};

addStructuredData();
