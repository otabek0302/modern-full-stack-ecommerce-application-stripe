import { Country, getCountryByCode } from './countries.utils';

export interface GeolocationData {
    country: string;
    countryCode: string;
    region?: string;
    city?: string;
    timezone?: string;
    ip?: string;
    latitude?: number;
    longitude?: number;
}

export interface DetectedLocation {
    country: Country | null;
    city?: string;
    region?: string;
    timezone?: string;
    confidence: 'high' | 'medium' | 'low';
    source: string;
}

// Cache for geolocation data to avoid repeated API calls
let geoCache: DetectedLocation | null = null;
let geoCacheTimestamp: number = 0;
const GEO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Detects user's country using multiple geolocation services
 * @param countries - Array of countries to match against
 * @param useCache - Whether to use cached results
 * @returns Promise<DetectedLocation>
 */
export async function detectUserCountry(countries: Country[], useCache: boolean = true): Promise<DetectedLocation> {
    // Validate input
    if (!countries || countries.length === 0) {
        // No countries provided for detection
        return getFallbackLocation([]);
    }

    // Return cached result if available and not expired
    if (useCache && geoCache && (Date.now() - geoCacheTimestamp) < GEO_CACHE_DURATION) {
        // Using cached geolocation data
        return geoCache;
    }


    
    // Try multiple services in order of preference
    const services = [
        () => detectWithIpapi(countries),
        () => detectWithIpgeolocation(countries),
        () => detectWithCloudflare(countries),
        () => detectWithBrowserGeolocation(countries),
        () => detectWithTimezone(countries)
    ];

    for (const service of services) {
        try {
            const result = await service();
            if (result && result.country) {

                
                // Cache successful result
                geoCache = result;
                geoCacheTimestamp = Date.now();
                
                return result;
            }
        } catch (error) {
    
            continue;
        }
    }

    // If all services fail, return fallback

    return getFallbackLocation(countries);
}

/**
 * Detect location using ipapi.co (free tier: 1000 requests/day)
 */
async function detectWithIpapi(countries: Country[]): Promise<DetectedLocation> {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Ecobazar-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`ipapi.co failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`ipapi.co error: ${data.reason}`);
        }

        const country = getCountryByCode(countries, data.country_code);
        
        return {
            country,
            city: data.city,
            region: data.region,
            timezone: data.timezone,
            confidence: country ? 'high' : 'low',
            source: 'ipapi.co'
        };
    } catch (error) {
        throw new Error(`ipapi.co detection failed: ${error}`);
    }
}

/**
 * Detect location using ipgeolocation.io (free tier: 1000 requests/month)
 */
async function detectWithIpgeolocation(countries: Country[]): Promise<DetectedLocation> {
    try {
        const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Ecobazar-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`ipgeolocation.io failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.message && data.message.includes('limit')) {
            throw new Error('ipgeolocation.io rate limit exceeded');
        }

        const country = getCountryByCode(countries, data.country_code2);
        
        return {
            country,
            city: data.city,
            region: data.state_prov,
            timezone: data.time_zone?.name,
            confidence: country ? 'high' : 'low',
            source: 'ipgeolocation.io'
        };
    } catch (error) {
        throw new Error(`ipgeolocation.io detection failed: ${error}`);
    }
}

/**
 * Detect location using Cloudflare's CF-IPCountry header (works when behind Cloudflare)
 */
async function detectWithCloudflare(countries: Country[]): Promise<DetectedLocation> {
    try {
        // This would work if the app is behind Cloudflare
        // For now, we'll simulate by checking if we can get the header
        const response = await fetch('/api/geolocation/cloudflare', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Cloudflare detection not available');
        }

        const data = await response.json();
        const country = getCountryByCode(countries, data.countryCode);
        
        return {
            country,
            confidence: country ? 'medium' : 'low',
            source: 'Cloudflare'
        };
    } catch (error) {
        throw new Error(`Cloudflare detection failed: ${error}`);
    }
}

/**
 * Detect location using browser's geolocation API
 */
async function detectWithBrowserGeolocation(countries: Country[]): Promise<DetectedLocation> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Browser geolocation not supported'));
            return;
        }

        const timeout = setTimeout(() => {
            reject(new Error('Browser geolocation timeout'));
        }, 10000);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                clearTimeout(timeout);
                try {
                    // Use reverse geocoding to get country from coordinates
                    const country = await reverseGeocode(
                        position.coords.latitude,
                        position.coords.longitude,
                        countries
                    );
                    
                    resolve({
                        country,
                        confidence: country ? 'medium' : 'low',
                        source: 'Browser Geolocation'
                    });
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                clearTimeout(timeout);
                reject(new Error(`Browser geolocation error: ${error.message}`));
            },
            {
                timeout: 10000,
                enableHighAccuracy: false,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

/**
 * Detect location using timezone (less accurate but always available)
 */
async function detectWithTimezone(countries: Country[]): Promise<DetectedLocation> {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Map common timezones to countries
        const timezoneCountryMap: Record<string, string> = {
            'America/New_York': 'US',
            'America/Los_Angeles': 'US',
            'America/Chicago': 'US',
            'America/Denver': 'US',
            'America/Toronto': 'CA',
            'America/Vancouver': 'CA',
            'Europe/London': 'GB',
            'Europe/Paris': 'FR',
            'Europe/Berlin': 'DE',
            'Europe/Rome': 'IT',
            'Europe/Madrid': 'ES',
            'Asia/Tokyo': 'JP',
            'Asia/Shanghai': 'CN',
            'Asia/Seoul': 'KR',
            'Asia/Kolkata': 'IN',
            'Australia/Sydney': 'AU',
            'Australia/Melbourne': 'AU',
            'Pacific/Auckland': 'NZ',
            'America/Sao_Paulo': 'BR',
            'America/Mexico_City': 'MX',
            'Africa/Cairo': 'EG',
            'Europe/Moscow': 'RU'
        };

        const countryCode = timezoneCountryMap[timezone];
        const country = countryCode ? getCountryByCode(countries, countryCode) : null;
        
        return {
            country,
            timezone,
            confidence: country ? 'low' : 'low',
            source: 'Timezone Detection'
        };
    } catch (error) {
        throw new Error(`Timezone detection failed: ${error}`);
    }
}

/**
 * Reverse geocode coordinates to get country information
 */
async function reverseGeocode(lat: number, lng: number, countries: Country[]): Promise<Country | null> {
    try {
        // Using a free reverse geocoding service
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Reverse geocoding failed: ${response.status}`);
        }

        const data = await response.json();
        return getCountryByCode(countries, data.countryCode);
    } catch (error) {
        // Reverse geocoding failed
        return null;
    }
}

/**
 * Returns a fallback location (US) when all detection methods fail
 */
function getFallbackLocation(countries: Country[]): DetectedLocation {
    const fallbackCountry = countries.length > 0 ? getCountryByCode(countries, 'US') : null;
    
    return {
        country: fallbackCountry,
        confidence: 'low',
        source: 'Fallback (US)'
    };
}



/**
 * Validates if a country code looks valid
 */
export function isValidCountryCode(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
}

/**
 * Gets user's preferred countries based on browser language
 */
export function getPreferredCountries(countries: Country[]): Country[] {
    const browserLang = navigator.language || 'en-US';
    const langCountryMap: Record<string, string[]> = {
        'en-US': ['US', 'CA', 'GB', 'AU'],
        'en-GB': ['GB', 'US', 'CA', 'AU'],
        'en-CA': ['CA', 'US', 'GB', 'AU'],
        'en-AU': ['AU', 'GB', 'US', 'CA'],
        'fr-FR': ['FR', 'CA', 'BE', 'CH'],
        'fr-CA': ['CA', 'FR', 'US', 'BE'],
        'de-DE': ['DE', 'AT', 'CH', 'LU'],
        'es-ES': ['ES', 'MX', 'AR', 'CO'],
        'es-MX': ['MX', 'US', 'ES', 'AR'],
        'pt-BR': ['BR', 'PT', 'AO', 'MZ'],
        'it-IT': ['IT', 'CH', 'SM', 'VA'],
        'ja-JP': ['JP'],
        'ko-KR': ['KR'],
        'zh-CN': ['CN', 'HK', 'TW', 'SG'],
        'ru-RU': ['RU', 'BY', 'KZ', 'KG']
    };

    const preferredCodes = langCountryMap[browserLang] || langCountryMap['en-US'];
    const preferredCountries: Country[] = [];
    
    // Add preferred countries first
    preferredCodes.forEach(code => {
        const country = getCountryByCode(countries, code);
        if (country) {
            preferredCountries.push(country);
        }
    });

    // Add remaining countries
    const remainingCountries = countries.filter(country => 
        !preferredCodes.includes(country.cca2)
    );

    return [...preferredCountries, ...remainingCountries];
}
