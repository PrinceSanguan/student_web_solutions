<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="application-name" content="Student Web Solutions">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Student Web Solutions offers professional web design, website creation, computer systems, mobile apps, POS solutions and more to grow your business online.">
    <meta name="keywords"
        content="web design, website creation, computer systems, mobile apps, POS solutions, business growth, web development">
    <meta name="author" content="Student Web Solutions">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Student Web Solutions | Professional Web & System Development">
    <meta property="og:description"
        content="Professional web design, website creation, computer systems, mobile apps, and POS solutions to grow your business.">
    <meta property="og:image" content="{{ asset('assets/images/logo.png') }}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="Student Web Solutions | Professional Web & System Development">
    <meta name="twitter:description"
        content="Professional web design, website creation, computer systems, mobile apps, and POS solutions to grow your business.">
    <meta name="twitter:image" content="{{ asset('assets/images/logo.png') }}">

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="shortcut icon" href="{{ asset('assets/images/logo.png') }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('assets/images/logo.png') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">

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
    <title>Professional Web & System Development</title>

    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Student Web Solutions",
        "description": "Professional web design, website creation, computer systems, mobile applications, POS solutions and more for businesses",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('assets/images/logo.png') }}",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support"
        }
    }
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
