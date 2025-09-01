export interface Country {
    name: {
        common: string;
        official: string;
    };
    cca2: string;
    cca3: string;
    flag: string;
    region?: string;
    subregion?: string;
    population?: number;
    currencies?: Record<string, { name: string; symbol: string }>;
    languages?: Record<string, string>;
    capital?: string[];
    timezones?: string[];
}

// API v2 response format
interface CountryV2 {
    name: string;
    alpha2Code: string;
    alpha3Code: string;
    flag: string;
    region: string;
    subregion: string;
    population: number;
    currencies: Record<string, string>;
    languages: Record<string, string>;
    capital: string;
    timezones: string[];
}

export interface CountryOption {
    value: string;
    label: string;
    flag: string;
    code: string;
}

// Cache for countries to avoid repeated API calls
let countriesCache: Country[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches countries from the REST Countries API
 * @param forceRefresh - Force refresh the cache
 * @returns Promise<Country[]>
 */
export async function fetchCountries(forceRefresh: boolean = false): Promise<Country[]> {
    // Return cached countries if available and not expired
    if (!forceRefresh && countriesCache && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        return countriesCache;
    }

    // Retry configuration
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {


            // Try the main endpoint first
            let response = await fetch('https://restcountries.com/v3.1/all', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Ecobazar-App/1.0'
                }
            });

            if (!response.ok) {

                // If main endpoint fails, try with specific fields
                response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flag', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Ecobazar-App/1.0'
                    }
                });
            }

            if (!response.ok) {

                // If both fail, try the v2 endpoint as fallback
                response = await fetch('https://restcountries.com/v2/all', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Ecobazar-App/1.0'
                    }
                });
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();


            // Handle different API response formats
            let processedCountries: Country[] = [];

            if (data.length > 0 && data[0].name && typeof data[0].name === 'object') {
                // v3 API format
                processedCountries = data.map((country: Country) => ({
                    name: country.name,
                    cca2: country.cca2,
                    cca3: country.cca3,
                    flag: country.flag,
                    region: country.region,
                    subregion: country.subregion,
                    population: country.population,
                    currencies: country.currencies,
                    languages: country.languages,
                    capital: country.capital,
                    timezones: country.timezones
                }));
            } else if (data.length > 0 && data[0].alpha2Code) {
                // v2 API format fallback
                processedCountries = data.map((country: CountryV2) => ({
                    name: {
                        common: country.name,
                        official: country.name
                    },
                    cca2: country.alpha2Code,
                    cca3: country.alpha3Code,
                    flag: country.flag,
                    region: country.region,
                    subregion: country.subregion,
                    population: country.population,
                    currencies: country.currencies,
                    languages: country.languages,
                    capital: country.capital ? [country.capital] : [],
                    timezones: country.timezones ? [country.timezones] : []
                }));
            } else {
                throw new Error('Invalid API response format');
            }

            // Sort countries alphabetically by common name
            const sortedCountries = processedCountries.sort((a, b) =>
                a.name.common.localeCompare(b.name.common)
            );

            // Update cache
            countriesCache = sortedCountries;
            cacheTimestamp = Date.now();


            return sortedCountries;

        } catch (error) {


            if (attempt === maxRetries) {

                break;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
    }

    // If all attempts failed, return fallback countries

    return getFallbackCountries();
}

/**
 * Returns fallback countries if the API fails
 * @returns Country[]
 */
export function getFallbackCountries(): Country[] {
    return [
        {
            name: { common: 'United States', official: 'United States of America' },
            cca2: 'US',
            cca3: 'USA',
            flag: '🇺🇸',
            region: 'Americas',
            subregion: 'North America'
        },
        {
            name: { common: 'Canada', official: 'Canada' },
            cca2: 'CA',
            cca3: 'CAN',
            flag: '🇨🇦',
            region: 'Americas',
            subregion: 'North America'
        },
        {
            name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' },
            cca2: 'GB',
            cca3: 'GBR',
            flag: '🇬🇧',
            region: 'Europe',
            subregion: 'Northern Europe'
        },
        {
            name: { common: 'Germany', official: 'Federal Republic of Germany' },
            cca2: 'DE',
            cca3: 'DEU',
            flag: '🇩🇪',
            region: 'Europe',
            subregion: 'Western Europe'
        },
        {
            name: { common: 'France', official: 'French Republic' },
            cca2: 'FR',
            cca3: 'FRA',
            flag: '🇫🇷',
            region: 'Europe',
            subregion: 'Western Europe'
        },
        {
            name: { common: 'Australia', official: 'Commonwealth of Australia' },
            cca2: 'AU',
            cca3: 'AUS',
            flag: '🇦🇺',
            region: 'Oceania',
            subregion: 'Australia and New Zealand'
        },
        {
            name: { common: 'Japan', official: 'Japan' },
            cca2: 'JP',
            cca3: 'JPN',
            flag: '🇯🇵',
            region: 'Asia',
            subregion: 'Eastern Asia'
        },
        {
            name: { common: 'India', official: 'Republic of India' },
            cca2: 'IN',
            cca3: 'IND',
            flag: '🇮🇳',
            region: 'Asia',
            subregion: 'Southern Asia'
        },
        {
            name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
            cca2: 'BR',
            cca3: 'BRA',
            flag: '🇧🇷',
            region: 'Americas',
            subregion: 'South America'
        },
        {
            name: { common: 'Mexico', official: 'United Mexican States' },
            cca2: 'MX',
            cca3: 'MEX',
            flag: '🇲🇽',
            region: 'Americas',
            subregion: 'North America'
        }
    ];
}

/**
 * Converts countries to select options format
 * @param countries - Array of countries
 * @returns CountryOption[]
 */
export function countriesToOptions(countries: Country[]): CountryOption[] {
    return countries.map(country => ({
        value: country.name.common,
        label: country.name.common,
        flag: country.flag,
        code: country.cca2
    }));
}

/**
 * Searches countries by name
 * @param countries - Array of countries
 * @param searchTerm - Search term
 * @returns Country[]
 */
export function searchCountries(countries: Country[], searchTerm: string): Country[] {
    if (!searchTerm.trim()) return countries;

    const term = searchTerm.toLowerCase();
    return countries.filter(country =>
        country.name.common.toLowerCase().includes(term) ||
        country.name.official.toLowerCase().includes(term) ||
        country.cca2.toLowerCase().includes(term) ||
        country.cca3.toLowerCase().includes(term)
    );
}

/**
 * Gets country by name
 * @param countries - Array of countries
 * @param countryName - Country name to find
 * @returns Country | undefined
 */
export function getCountryByName(countries: Country[], countryName: string): Country | undefined {
    return countries.find(country =>
        country.name.common === countryName ||
        country.name.official === countryName
    );
}

/**
 * Gets country by code
 * @param countries - Array of countries
 * @param code - Country code (cca2 or cca3)
 * @returns Country | undefined
 */
export function getCountryByCode(countries: Country[], code: string): Country | undefined {
    const upperCode = code.toUpperCase();
    return countries.find(country =>
        country.cca2 === upperCode ||
        country.cca3 === upperCode
    );
}
