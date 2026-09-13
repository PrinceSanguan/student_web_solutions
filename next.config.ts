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

    experimental: {
        serverActions: {
            /**
             * The capstone form can carry a source-code archive. Laravel allowed
             * 100 MB (`max:102400` kilobytes) and the default here is 1 MB, so
             * without this every real upload fails.
             *
             * The cost is real: a Server Action body is buffered in memory, so a
             * 100 MB upload is 100 MB of RSS for the duration. Lower this if the
             * files you actually attach are smaller.
             */
            bodySizeLimit: '100mb',
        },
    },
};

export default nextConfig;
