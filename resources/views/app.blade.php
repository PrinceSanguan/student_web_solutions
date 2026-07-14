<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="application-name" content="Student Web Solutions">

    <!-- Best Practices -->
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta name="color-scheme" content="light">
    <meta name="theme-color" content="#ffffff">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Student Web Solutions - #1 capstone system maker in the Philippines. We build capstone projects, thesis systems, library systems, POS, school management systems delivered in 1-2 days. Affordable rates starting ₱10,000. Trusted by Filipino students and businesses.">
    <meta name="keywords"
        content="capstone philippines, paggawa ng capstone, capstone system maker, capstone project philippines, thesis system philippines, library system philippines, school system philippines, POS system philippines, web developer philippines, affordable web developer philippines, student web solutions, capstone maker philippines, information system philippines, laravel developer philippines, website maker philippines, web development philippines">
    <meta name="author" content="Prince Sanguan - Student Web Solutions">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <meta name="geo.region" content="PH">
    <meta name="geo.country" content="Philippines">
    <meta name="language" content="English, Filipino">
    <meta name="revisit-after" content="7 days">
    <meta name="rating" content="general">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_PH">
    <meta property="og:site_name" content="Student Web Solutions">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Student Web Solutions | Capstone System Maker Philippines | Paggawa ng Capstone">
    <meta property="og:description"
        content="Need a capstone system? We build complete thesis & capstone projects in 1-2 days starting at ₱10,000. Library systems, POS, school systems. Trusted by 100+ Filipino students. Message us now!">
    <meta property="og:image" content="{{ asset('assets/images/logo.png') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Student Web Solutions - Capstone System Maker Philippines">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@studentwebsolutions">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="Student Web Solutions | Capstone System Maker Philippines">
    <meta name="twitter:description"
        content="We build capstone & thesis systems in 1-2 days. Starting ₱10,000. Library, POS, School systems. Message us!">
    <meta name="twitter:image" content="{{ asset('assets/images/logo.png') }}">

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="shortcut icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('assets/images/logo.png') }}">

    <!-- Minimal critical style + system font stack (no external fonts) -->
    <style>
        html {
            background-color: #ffffff;
        }

        html.dark {
            background-color: #ffffff;
        }

        body {
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }
    </style>

    <!-- Title -->
    <title>Student Web Solutions | Capstone System Maker Philippines | Paggawa ng Capstone | ₱10,000</title>

    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Student Web Solutions",
        "alternateName": "SWS - Capstone System Maker Philippines",
        "description": "Professional capstone system maker in the Philippines. We build thesis systems, library systems, POS, school management systems, and custom web applications in 1-2 days starting at ₱10,000.",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('assets/images/logo.png') }}",
        "image": "{{ asset('assets/images/logo.png') }}",
        "telephone": "",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "PH",
            "addressRegion": "Philippines"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "addressCountry": "PH"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Philippines"
        },
        "priceRange": "₱10,000 - ₱50,000",
        "currenciesAccepted": "PHP",
        "openingHours": "Mo-Su 00:00-24:00",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web Development Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Capstone System Development",
                        "description": "Complete capstone and thesis system development for Filipino students"
                    },
                    "price": "10000",
                    "priceCurrency": "PHP"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Library System",
                        "description": "Library management system with borrowing, return, and inventory"
                    },
                    "price": "15000",
                    "priceCurrency": "PHP"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "School Information System",
                        "description": "Complete school or student information management system"
                    },
                    "price": "18000",
                    "priceCurrency": "PHP"
                }
            ]
        },
        "sameAs": [
            "https://www.facebook.com/Grandmaster1997/",
            "https://github.com/PrinceSanguan"
        ],
        "founder": {
            "@type": "Person",
            "name": "Prince E. Sanguan",
            "jobTitle": "Lead Web Developer",
            "sameAs": "https://psanguan.com"
        }
    }
    </script>

    <!-- Inertia.js & Vite Integration -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="antialiased">
    @inertia
</body>

</html>
