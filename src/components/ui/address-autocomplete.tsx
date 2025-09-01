"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface AddressAutocompleteProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onAddressSelect?: (address: AddressData) => void;
    className?: string;
    disabled?: boolean;
}

interface AddressData {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    formattedAddress: string;
}

// Placeholder component for future Google Places/Mapbox integration
const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    label = "Address",
    placeholder = "Start typing your address...",
    value,
    onChange,
    onAddressSelect,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<AddressData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock suggestions for demonstration
    // In production, this would be replaced with actual API calls
    const generateMockSuggestions = (query: string): AddressData[] => {
        if (query.length < 3) return [];
        
        const mockAddresses: AddressData[] = [
            {
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "US",
                formattedAddress: "123 Main Street, New York, NY 10001, US"
            },
            {
                street: "456 Oak Avenue",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90210",
                country: "US",
                formattedAddress: "456 Oak Avenue, Los Angeles, CA 90210, US"
            },
            {
                street: "789 Pine Road",
                city: "Chicago",
                state: "IL",
                zipCode: "60601",
                country: "US",
                formattedAddress: "789 Pine Road, Chicago, IL 60601, US"
            }
        ];

        return mockAddresses.filter(addr => 
            addr.formattedAddress.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onChange(query);
        
        if (query.length >= 3) {
            setIsLoading(true);
            // Simulate API delay
            setTimeout(() => {
                const suggestions = generateMockSuggestions(query);
                setSuggestions(suggestions);
                setIsLoading(false);
                setIsOpen(suggestions.length > 0);
            }, 300);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleAddressSelect = (address: AddressData) => {
        onChange(address.formattedAddress);
        onAddressSelect?.(address);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setIsOpen(true);
        }
    };

    const handleInputBlur = () => {
        // Delay closing to allow for clicks on suggestions
        setTimeout(() => setIsOpen(false), 200);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <Label htmlFor="address-input" className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </Label>
            )}
            
            <div className="relative">
                <Input
                    ref={inputRef}
                    id="address-input"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    disabled={disabled}
                    className="pr-10"
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <MapPin className="h-4 w-4 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                            onClick={() => handleAddressSelect(suggestion)}
                        >
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {suggestion.street}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Future Integration Notice */}
            <div className="mt-2 text-xs text-gray-500">
                💡 <strong>Coming Soon:</strong> Real address autocomplete with Google Places API
            </div>
        </div>
    );
};

export default AddressAutocomplete;
