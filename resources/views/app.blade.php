<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="application-name" content="Student Web Solutions">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Capstone Philippines - Expert website maker and Philippines programmer specializing in paggawa capstone projects. Professional capstone make services for students and businesses.">
    <meta name="keywords"
        content="capstone philippines, paggawa capstone, capstone make, website maker, philippines programmer, philippines capstone, capstone, web development philippines, student capstone projects">
    <meta name="author" content="Student Web Solutions">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title"
        content="Capstone Philippines | Website Maker & Philippines Programmer | Paggawa Capstone">
    <meta property="og:description"
        content="Expert capstone philippines services. Professional website maker and philippines programmer for paggawa capstone projects.">
    <meta property="og:image" content="{{ asset('assets/images/logo.png') }}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title"
        content="Capstone Philippines | Website Maker & Philippines Programmer | Paggawa Capstone">
    <meta name="twitter:description"
        content="Expert capstone philippines services. Professional website maker and philippines programmer for paggawa capstone projects.">
    <meta name="twitter:image" content="{{ asset('assets/images/logo.png') }}">

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="shortcut icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('assets/images/logo.png') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}" />

    <!-- Preload Fonts for Faster Rendering -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Optimized Styling -->
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        /* Ensuring dark mode does not override styles */
        html.dark {
            background-color: oklch(1 0 0);
        }
    </style>

    <!-- Title -->
    <title>Capstone Philippines | Website Maker & Philippines Programmer | Paggawa Capstone</title>

    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Capstone Philippines - Website Maker & Philippines Programmer",
        "description": "Expert capstone philippines services, website maker, and philippines programmer specializing in paggawa capstone projects and capstone make solutions",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('assets/images/logo.png') }}",
        "keywords": ["capstone philippines", "paggawa capstone", "capstone make", "website maker", "philippines programmer", "philippines capstone", "capstone"],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support"
        }
    }
    </script>

    <!-- Security Meta Tags -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    <!-- Microsoft Clarity - deferred to avoid blocking -->
    <script>
        window.addEventListener('load', function() {
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() {
                    (c[a].q = c[a].q || []).push(arguments)
                };
                t = l.createElement(r);
                t.async = 1;
                t.defer = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "rvk16k915r");
        });
    </script>

    <!-- Inertia.js & Vite Integration -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
