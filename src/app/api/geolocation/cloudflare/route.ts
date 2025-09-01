import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get country from Cloudflare headers (if behind Cloudflare)
        const countryCode = request.headers.get('CF-IPCountry') || 
                           request.headers.get('cf-ipcountry') ||
                           request.headers.get('X-Country-Code') ||
                           request.headers.get('CloudFront-Viewer-Country'); // AWS CloudFront
        
        if (!countryCode || countryCode === 'XX') {
            return NextResponse.json(
                { error: 'Country detection not available' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            countryCode: countryCode.toUpperCase(),
            source: 'CDN Headers',
            headers: {
                'CF-IPCountry': request.headers.get('CF-IPCountry'),
                'cf-ipcountry': request.headers.get('cf-ipcountry'),
                'X-Country-Code': request.headers.get('X-Country-Code'),
                'CloudFront-Viewer-Country': request.headers.get('CloudFront-Viewer-Country')
            }
        });
    } catch (error) {
        console.error('Cloudflare geolocation error:', error);
        return NextResponse.json(
            { error: 'Failed to detect country from CDN headers' },
            { status: 500 }
        );
    }
}
