if (!self.define) {
    let e,
        s = {};
    const a = (a, i) => (
        (a = new URL(a + ".js", i).href),
        s[a] ||
            new Promise((s) => {
                if ("document" in self) {
                    const e = document.createElement("script");
                    ((e.src = a), (e.onload = s), document.head.appendChild(e));
                } else ((e = a), importScripts(a), s());
            }).then(() => {
                let e = s[a];
                if (!e) throw new Error(`Module ${a} didn’t register its module`);
                return e;
            })
    );
    self.define = (i, n) => {
        const c = e || ("document" in self ? document.currentScript.src : "") || location.href;
        if (s[c]) return;
        let t = {};
        const r = (e) => a(e, c),
            u = { module: { uri: c }, exports: t, require: r };
        s[c] = Promise.all(i.map((e) => u[e] || r(e))).then((e) => (n(...e), t));
    };
}
define(["./workbox-4754cb34"], function (e) {
    "use strict";
    (importScripts(),
        self.skipWaiting(),
        e.clientsClaim(),
        e.precacheAndRoute(
            [
                { url: "/_next/app-build-manifest.json", revision: "7e2636a1a77615f03b5eb9bec9efd28e" },
                { url: "/_next/static/chunks/1013-9b9cf90742dbe7cc.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/1218-6de739dd7688de70.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/1684-b7e7838c25444760.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/1995-0127ecfec587e7df.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/2108-8010ac8860913d1d.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/3300-2eb5c4db3776ae0f.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/3548-155b72389308ab36.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/3838-a7f71695fbc2e2f3.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/404-a022a675ef90120c.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/4228-8e3d42fd63c6efe5.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/4277-c07a353588e53789.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/4bd1b696-da4a3cb20ea47718.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/5118-c2d252a364f9868b.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/5269-df55872ab536efb9.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/5384-efddf0c8eec7fe31.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/5941-112f584c96ea8f59.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/6531-ca1a5b1af7d68b7a.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/6766-5de8aa963a6b5630.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/6874-0ad18a799f3b83c6.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/7491-91841ff144b3c6c6.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/7500-90bee46a7292e540.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/7696-6cd241ce034587f8.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/7836-b3e59cfde183d177.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/8372-4119939a3d93b7a7.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/9407-6352d138e7f5fdf6.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/9490-ac543a076b5de242.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/9867-486b9fda6d8d5b31.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/_not-found/page-c35a1ec2f00a4603.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/courses/%5Bid%5D/edit-course/page-832b5800f616a110.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/courses/%5Bid%5D/page-06c54c23f8f575d5.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/courses/create-course/page-cdb88cc627072028.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/courses/page-76daf7192b9fd91b.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/layout-924cdbe92d1f9972.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/layout-page/%5Bid%5D/edit-layout-page/page-c9ca01862a64100e.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/layout-page/%5Bid%5D/page-344da85250992c1f.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/layout-page/create-layout-page/page-4277f20b5f489697.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/layout-page/page-440850a263861d33.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/orders/page-22f8a490c31d6bce.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/page-1a93b248dfb1d30b.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/users/%5Bid%5D/edit-user/page-fe7310c5b1d3639d.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/users/%5Bid%5D/page-9d70f1e5ed22ffda.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/users/create-user/page-8db18553d8ef56dd.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/admin/users/page-6cc6a0812649e82d.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-329b56f181f50b64.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/layout-51b4d37cae54cb2c.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/loading-4a088d1407ee3db7.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/login/page-edaa26d55828f2c3.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/not-found-bd7d95ecdee08129.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/page-9d9d5693db0bf2e0.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/profile/courses/page-1832486df718853e.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/profile/layout-fcd5853c00330261.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/profile/notifications/page-965f0cba42d7f858.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/profile/page-48227adeab4859a2.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/app/profile/settings/page-90a9c89925170a62.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/f4898fe8-f7141763bbdd96b4.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/framework-400494aa14c16ece.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/main-app-6a046b00cb8542a7.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/main-e1a371701dbaacf1.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/pages/_app-5d1abe03d322390c.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/pages/_error-3b2a1d523de49635.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/chunks/polyfills-42372ed130431b0a.js", revision: "846118c33b2c0e922d7b3a7676f81f6f" },
                { url: "/_next/static/chunks/webpack-f3d5c9aaef67d45b.js", revision: "kL-A4MgCwuGRzQ8xxGC57" },
                { url: "/_next/static/css/e18c762dba87c118.css", revision: "e18c762dba87c118" },
                { url: "/_next/static/kL-A4MgCwuGRzQ8xxGC57/_buildManifest.js", revision: "d52c3b8b8d03eb8ebb7dbf65c97b237f" },
                { url: "/_next/static/kL-A4MgCwuGRzQ8xxGC57/_ssgManifest.js", revision: "b6652df95db52feb4daf4eca35380933" },
                { url: "/_next/static/media/034d78ad42e9620c-s.woff2", revision: "be7c930fceb794521be0a68e113a71d8" },
                { url: "/_next/static/media/0484562807a97172-s.p.woff2", revision: "b550bca8934bd86812d1f5e28c9cc1de" },
                { url: "/_next/static/media/29a4aea02fdee119-s.woff2", revision: "69d9d2cdadeab7225297d50fc8e48e8b" },
                { url: "/_next/static/media/29e7bbdce9332268-s.woff2", revision: "9e3ecbe4bb4c6f0b71adc1cd481c2bdc" },
                { url: "/_next/static/media/8888a3826f4a3af4-s.p.woff2", revision: "792477d09826b11d1e5a611162c9797a" },
                { url: "/_next/static/media/a1386beebedccca4-s.woff2", revision: "d3aa06d13d3cf9c0558927051f3cb948" },
                { url: "/_next/static/media/b957ea75a84b6ea7-s.p.woff2", revision: "0bd523f6049956faaf43c254a719d06a" },
                { url: "/_next/static/media/c3bc380753a8436c-s.woff2", revision: "5a1b7c983a9dc0a87a2ff138e07ae822" },
                { url: "/_next/static/media/db911767852bc875-s.woff2", revision: "9516f567cd80b0f418bba2f1299ed6d1" },
                { url: "/_next/static/media/eafabf029ad39a43-s.p.woff2", revision: "43751174b6b810eb169101a20d8c26f8" },
                { url: "/_next/static/media/f10b8e9d91f3edcb-s.woff2", revision: "63af7d5e18e585fad8d0220e5d551da1" },
                { url: "/_next/static/media/fe0777f1195381cb-s.woff2", revision: "f2a04185547c36abfa589651236a9849" },
                { url: "/_next/static/media/github-icon.6f34ed5d.png", revision: "3206128832fa4dda4679e17f60f99d7d" },
                { url: "/_next/static/media/google-icon.803d536a.png", revision: "2892cd76d5e83ef784811ce868b3fddd" },
                { url: "/_next/static/media/login.4a2c8b32.png", revision: "e03246cec49135d528ca7aed2d4a421b" },
                { url: "/_next/static/media/logo.76fe6378.png", revision: "81ca074ba4bcc7c14c30ef2cc709664a" },
                { url: "/_next/static/media/register.bf7e3f4e.png", revision: "65823619cc8f529506bae4202e6f5aa1" },
                { url: "/_next/static/media/verification.4cf4c048.png", revision: "2b2bfa3d1a973c7ca35e4494d6e8f698" },
                { url: "/android-icon-144x144.png", revision: "571efc7990645c2789fd435e25894a57" },
                { url: "/android-icon-192x192.png", revision: "928db23db607ef825754460758f63f97" },
                { url: "/android-icon-36x36.png", revision: "b6e3202ef2f8e0681f079ea702804efd" },
                { url: "/android-icon-48x48.png", revision: "696b34cfde778c0e2bc94c6a2d0153ac" },
                { url: "/android-icon-72x72.png", revision: "8723d30aa3eb5ec8d7a34b4165fd5f71" },
                { url: "/android-icon-96x96.png", revision: "f12e089a2e0e580b048430ca5553fbdc" },
                { url: "/apple-icon-114x114.png", revision: "505f8c5bfd117118a7b883a68275a4fd" },
                { url: "/apple-icon-120x120.png", revision: "c798fbc9dd34bc8a02d4ddb8f0dd36de" },
                { url: "/apple-icon-144x144.png", revision: "5bfb06733ad93df8cd32a7c3a26ea7c6" },
                { url: "/apple-icon-152x152.png", revision: "46a0dc07a73c152434060e3e9738597f" },
                { url: "/apple-icon-180x180.png", revision: "8489a4f5b03a35534a512d09f5da4b29" },
                { url: "/apple-icon-57x57.png", revision: "dd8b550bea6476086088da2771d16c8c" },
                { url: "/apple-icon-60x60.png", revision: "bcf9ec9a6cd08a127c691a3dc53845a1" },
                { url: "/apple-icon-72x72.png", revision: "8723d30aa3eb5ec8d7a34b4165fd5f71" },
                { url: "/apple-icon-76x76.png", revision: "a47e1612707dddd6f0faeccf2e57853d" },
                { url: "/apple-icon-precomposed.png", revision: "822e5f80a4e3cbefe14d4196796a3724" },
                { url: "/apple-icon.png", revision: "822e5f80a4e3cbefe14d4196796a3724" },
                { url: "/browserconfig.xml", revision: "27f779fed7419696250a5f746dc4f409" },
                { url: "/favicon-16x16.png", revision: "5e3430545ff74ea0156263b1104f0203" },
                { url: "/favicon-32x32.png", revision: "42b8a9ef2519ef76ee3da09993e12384" },
                { url: "/favicon-96x96.png", revision: "1d61f4903e36a97e649886abf465253f" },
                { url: "/manifest.json", revision: "10ac51758538ca4e3eacd0e5960a28b2" },
                { url: "/ms-icon-144x144.png", revision: "5bfb06733ad93df8cd32a7c3a26ea7c6" },
                { url: "/ms-icon-150x150.png", revision: "7c43750c266dc3624552304cf06c016c" },
                { url: "/ms-icon-310x310.png", revision: "e7faabaaf5090797987a784c56c8623f" },
                { url: "/ms-icon-70x70.png", revision: "d55fac3622d0fd308b77ca4f10024c0f" },
            ],
            { ignoreURLParametersMatching: [] }
        ),
        e.cleanupOutdatedCaches(),
        e.registerRoute("/", new e.NetworkFirst({ cacheName: "start-url", plugins: [{ cacheWillUpdate: async ({ request: e, response: s, event: a, state: i }) => (s && "opaqueredirect" === s.type ? new Response(s.body, { status: 200, statusText: "OK", headers: s.headers }) : s) }] }), "GET"),
        e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i, new e.CacheFirst({ cacheName: "google-fonts-webfonts", plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })] }), "GET"),
        e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i, new e.StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets", plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })] }), "GET"),
        e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i, new e.StaleWhileRevalidate({ cacheName: "static-font-assets", plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })] }), "GET"),
        e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, new e.StaleWhileRevalidate({ cacheName: "static-image-assets", plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\/_next\/image\?url=.+$/i, new e.StaleWhileRevalidate({ cacheName: "next-image", plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\.(?:mp3|wav|ogg)$/i, new e.CacheFirst({ cacheName: "static-audio-assets", plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\.(?:mp4)$/i, new e.CacheFirst({ cacheName: "static-video-assets", plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\.(?:js)$/i, new e.StaleWhileRevalidate({ cacheName: "static-js-assets", plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\.(?:css|less)$/i, new e.StaleWhileRevalidate({ cacheName: "static-style-assets", plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i, new e.StaleWhileRevalidate({ cacheName: "next-data", plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(/\.(?:json|xml|csv)$/i, new e.NetworkFirst({ cacheName: "static-data-assets", plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }), "GET"),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1;
                const s = e.pathname;
                return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
            },
            new e.NetworkFirst({ cacheName: "apis", networkTimeoutSeconds: 10, plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })] }),
            "GET"
        ),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1;
                return !e.pathname.startsWith("/api/");
            },
            new e.NetworkFirst({ cacheName: "others", networkTimeoutSeconds: 10, plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })] }),
            "GET"
        ),
        e.registerRoute(({ url: e }) => !(self.origin === e.origin), new e.NetworkFirst({ cacheName: "cross-origin", networkTimeoutSeconds: 10, plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })] }), "GET"));
});
