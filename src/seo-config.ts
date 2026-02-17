// SEO Component for structured data
export const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "HHBC Consulting Group",
    "description": "Consultoría Legal, TI y Contabilidad en Chile",
    "url": "https://hhbcconsultancy.sistemataup.online",
    "logo": "https://hhbcconsultancy.sistemataup.online/logo.png",
    "image": "https://hhbcconsultancy.sistemataup.online/logo.png",
    "telephone": "+56-2-XXXX-XXXX",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "CL",
        "addressLocality": "Santiago",
        "addressRegion": "Región Metropolitana"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-33.4489",
        "longitude": "-70.6693"
    },
    "areaServed": {
        "@type": "Country",
        "name": "Chile"
    },
    "serviceType": [
        "Consultoría Legal",
        "Consultoría de TI",
        "Consultoría Contable",
        "Transformación Digital",
        "Auditoría Empresarial"
    ],
    "priceRange": "$$",
    "foundingDate": "2014",
    "slogan": "Soluciones Empresariales Integrales"
};

export const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HHBC Consulting Group",
    "alternateName": "HHBC",
    "url": "https://hhbcconsultancy.sistemataup.online",
    "logo": "https://hhbcconsultancy.sistemataup.online/logo.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contacto@hhbcconsulting.cl",
        "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
        "https://www.linkedin.com/company/hhbc-consulting"
    ]
};
