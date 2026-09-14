import type { NextConfig } from 'next';

/**
 * The same response headers Laravel's `SecurityHeaders` middleware set.
 *
 * `Strict-Transport-Security` was conditional on `$request->isSecure()` there. A
 * browser ignores HSTS over plain HTTP, so sending it unconditionally is
 * equivalent in effect and avoids reading request state in config.
 */
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

export default nextConfig;
