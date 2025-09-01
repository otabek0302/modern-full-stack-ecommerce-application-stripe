import { useState, useEffect, useCallback } from 'react';
import { Country, fetchCountries } from '@/lib/countries.utils';
import { detectUserCountry, DetectedLocation } from '@/lib/geolocation.utils';

export interface UseCountryDetectionOptions {
    autoDetect?: boolean;
    useCache?: boolean;
    fallbackCountry?: string;
    onDetected?: (location: DetectedLocation) => void;
    onError?: (error: Error) => void;
}

export interface UseCountryDetectionReturn {
    detectedLocation: DetectedLocation | null;
    countries: Country[];
    isDetecting: boolean;
    isLoadingCountries: boolean;
    error: string | null;
    detectCountry: () => Promise<void>;
    retryDetection: () => Promise<void>;
}

/**
 * React hook for automatic country detection
 */
export function useCountryDetection(options: UseCountryDetectionOptions = {}): UseCountryDetectionReturn {
    const {
        autoDetect = true,
        useCache = true,
        fallbackCountry = 'US',
        onDetected,
        onError
    } = options;

    const [countries, setCountries] = useState<Country[]>([]);
    const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setIsLoadingCountries(true);
                setError(null);
                const countriesData = await fetchCountries();
                setCountries(countriesData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load countries';
                setError(errorMessage);
                onError?.(new Error(errorMessage));
            } finally {
                setIsLoadingCountries(false);
            }
        };

        loadCountries();
    }, []); // Remove onError dependency to prevent infinite re-renders

    // Detect country
    const detectCountry = useCallback(async () => {
        if (countries.length === 0) {
            return;
        }

        try {
            setIsDetecting(true);
            setError(null);
            

            const location = await detectUserCountry(countries, useCache);
            
            setDetectedLocation(location);
            onDetected?.(location);
            

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to detect country';

            setError(errorMessage);
            onError?.(new Error(errorMessage));
            
            // Set fallback location
            const fallbackCountryData = countries.find(c => c.cca2 === fallbackCountry);
            if (fallbackCountryData) {
                const fallbackLocation: DetectedLocation = {
                    country: fallbackCountryData,
                    confidence: 'low',
                    source: 'Fallback'
                };
                setDetectedLocation(fallbackLocation);
                onDetected?.(fallbackLocation);
            }
        } finally {
            setIsDetecting(false);
        }
    }, [countries, useCache, fallbackCountry]);

    // Auto-detect on countries load
    useEffect(() => {
        if (autoDetect && countries.length > 0 && !detectedLocation && !isDetecting) {
            detectCountry();
        }
    }, [autoDetect, countries.length, detectedLocation, isDetecting, detectCountry]);

    // Retry detection (force refresh)
    const retryDetection = useCallback(async () => {
        setDetectedLocation(null);
        setError(null);
        await detectCountry();
    }, [detectCountry]);

    return {
        detectedLocation,
        countries,
        isDetecting,
        isLoadingCountries,
        error,
        detectCountry,
        retryDetection
    };
}

/**
 * Hook for getting just the detected country code (simpler version)
 */
export function useDetectedCountry(autoDetect: boolean = true): {
    countryCode: string | null;
    isDetecting: boolean;
    error: string | null;
} {
    const { detectedLocation, isDetecting, error } = useCountryDetection({ autoDetect });
    
    return {
        countryCode: detectedLocation?.country?.cca2 || null,
        isDetecting,
        error
    };
}
