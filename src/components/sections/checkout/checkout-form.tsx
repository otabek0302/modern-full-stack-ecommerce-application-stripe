"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UserType, } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCountries, Country } from "@/lib/countries.utils";
import StripePaymentSection from "@/components/ui/stripe-payment-section";
import { getDiscountedPrice } from "@/lib/products.utils";
import { useStateContext } from "@/contexts/state-context";
import { useCountryDetection } from "@/hooks/useCountryDetection";
import { SafeComponent } from "@/components/ui/error-boundary";



interface CheckoutFormProps {
    user: UserType;
    onSubmit?: (formData: FormData) => Promise<void>;
    isSubmitting?: boolean;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    orderNotes: string;
    paymentMethod: string;
    shipToDifferentAddress: boolean;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    // Credit card fields (for backward compatibility)
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
}

interface FormErrors {
    [key: string]: string;
}

// LocalStorage keys
const STORAGE_KEYS = {
    CHECKOUT_FORM: 'checkout_form_data',
    SHIPPING_ADDRESS: 'checkout_shipping_address',
    PAYMENT_METHOD: 'checkout_payment_method',
    SHIP_TO_DIFFERENT: 'checkout_ship_to_different',
    CREDIT_CARD: 'checkout_credit_card'
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ user, onSubmit, isSubmitting = false }) => {
    const { cartItems } = useStateContext();
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [bankDetails, setBankDetails] = useState({
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: "",
    });
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        country: "",
        state: "",
        zipCode: "",
    });
    const [formData, setFormData] = useState<FormData>({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        orderNotes: "",
        paymentMethod: "cash",
        shipToDifferentAddress: false,
        shippingAddress: {
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            zipCode: user.address?.zipCode || "",
            country: user.address?.country || "",
        },
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);
    const [isRestoringData, setIsRestoringData] = useState(false);
    
    // Country detection
    const { 
        detectedLocation, 
        isDetecting, 
        error: detectionError,
        retryDetection 
    } = useCountryDetection({
        autoDetect: true,
        onDetected: (location) => {
            try {
                // Auto-fill country if detected and not already manually set
                if (location?.country) {
                    
                    setShippingAddress(prev => {
                        // Only auto-fill if country is empty or if it's the same as user's saved address
                        if (!prev.country || prev.country === user?.address?.country) {
                            const newAddress = {
                                ...prev,
                                country: location.country?.cca2 || ''
                            };

                            return newAddress;
                        }
                        return prev;
                    });
                }
            } catch (error) {
                // Error in country detection callback
            }
        },
        onError: (error) => {
            // Country detection failed silently
        }
    });
    
    // Stripe payment states
    const [stripePaymentSuccess, setStripePaymentSuccess] = useState(false);
    const [stripePaymentError, setStripePaymentError] = useState<string | null>(null);
    const [, setOrderId] = useState<string | null>(null);

    // Calculate order total for Stripe
    const calculateOrderTotal = () => {
        const subtotal = cartItems.reduce((total, item) => {
            const discountedPrice = getDiscountedPrice(item.product);
            return total + (discountedPrice * item.quantity);
        }, 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        return subtotal + shipping;
    };

    // Payment methods matching the order schema
    const paymentMethods = [
        { value: "cash", label: "Cash on Delivery", description: "Pay when you receive your order" },
        { value: "stripe", label: "Credit/Debit Card", description: "Pay securely with Stripe" },
    ];

    // Load saved form data from localStorage
    useEffect(() => {
        try {
            setIsRestoringData(true);
            
            // Load form data
            const savedFormData = localStorage.getItem(STORAGE_KEYS.CHECKOUT_FORM);
            if (savedFormData) {
                const parsed = JSON.parse(savedFormData);
                setFormData(prev => ({ ...prev, ...parsed }));
            }

            // Load shipping address
            const savedShippingAddress = localStorage.getItem(STORAGE_KEYS.SHIPPING_ADDRESS);
            if (savedShippingAddress) {
                const parsed = JSON.parse(savedShippingAddress);
                setShippingAddress(prev => ({ ...prev, ...parsed }));
            }

            // Load payment method
            const savedPaymentMethod = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHOD);
            if (savedPaymentMethod) {
                setPaymentMethod(savedPaymentMethod);
            }

            // Load ship to different address preference
            const savedShipToDifferent = localStorage.getItem(STORAGE_KEYS.SHIP_TO_DIFFERENT);
            if (savedShipToDifferent) {
                setShipToDifferentAddress(JSON.parse(savedShipToDifferent));
            }

            // Load credit card details
            const savedCreditCard = localStorage.getItem(STORAGE_KEYS.CREDIT_CARD);
            if (savedCreditCard) {
                const parsed = JSON.parse(savedCreditCard);
                setBankDetails(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            // Error loading saved form data
            clearSavedFormData();
        } finally {
            setIsRestoringData(false);
        }
    }, [user]);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        const saveFormData = () => {
            try {
                localStorage.setItem(STORAGE_KEYS.CHECKOUT_FORM, JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    orderNotes: formData.orderNotes,
                }));
            } catch (error) {
                // Error saving form data
            }
        };

        // Debounce the save operation
        const timeoutId = setTimeout(saveFormData, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.firstName, formData.lastName, formData.email, formData.phone, formData.orderNotes]);

    // Save shipping address to localStorage
    useEffect(() => {
        const saveShippingAddress = () => {
            try {
                localStorage.setItem(STORAGE_KEYS.SHIPPING_ADDRESS, JSON.stringify(shippingAddress));
            } catch (error) {
                // Error saving shipping address
            }
        };

        const timeoutId = setTimeout(saveShippingAddress, 500);
        return () => clearTimeout(timeoutId);
    }, [shippingAddress]);

    // Save payment method to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.PAYMENT_METHOD, paymentMethod);
        } catch (error) {
            // Error saving payment method
        }
    }, [paymentMethod]);

    // Save ship to different address preference
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.SHIP_TO_DIFFERENT, JSON.stringify(shipToDifferentAddress));
        } catch (error) {
            // Error saving ship to different address preference
        }
    }, [shipToDifferentAddress]);

    // Save credit card details to localStorage
    useEffect(() => {
        const saveCreditCard = () => {
            try {
                localStorage.setItem(STORAGE_KEYS.CREDIT_CARD, JSON.stringify(bankDetails));
            } catch (error) {
                // Error saving credit card details
            }
        };

        const timeoutId = setTimeout(saveCreditCard, 500);
        return () => clearTimeout(timeoutId);
    }, [bankDetails]);

    // Clear saved form data
    const clearSavedFormData = () => {
        try {
            localStorage.removeItem(STORAGE_KEYS.CHECKOUT_FORM);
            localStorage.removeItem(STORAGE_KEYS.SHIPPING_ADDRESS);
            localStorage.removeItem(STORAGE_KEYS.PAYMENT_METHOD);
            localStorage.removeItem(STORAGE_KEYS.SHIP_TO_DIFFERENT);
            localStorage.removeItem(STORAGE_KEYS.CREDIT_CARD);
        } catch (error) {
            // Error clearing saved form data
        }
    };

    useEffect(() => {
        if (!shipToDifferentAddress) {
            setShippingAddress({
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                zipCode: user.address?.zipCode || "",
                country: user.address?.country || "",
            });
        } else {
            setShippingAddress({
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            });
        }
    }, [shipToDifferentAddress, user.address]);

    // Get countries from the detection hook (which loads all countries)
    useEffect(() => {
        if (detectedLocation) {
            // Countries are already loaded in the detection hook
            // We'll get them from the hook's countries property
            setLoadingCountries(false);
        }
    }, [detectedLocation]);

    // Fetch countries on component mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoadingCountries(true);
                setCountriesError(null);
                const countriesData = await fetchCountries();
                setCountries(countriesData);
            } catch (error) {
                // Error loading countries
                setCountriesError("Failed to load countries. Please refresh the page.");
            } finally {
                setLoadingCountries(false);
            }
        };

        loadCountries();
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Required field validation
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        
        // Shipping address validation
        if (!shippingAddress.street.trim()) newErrors.street = "Street address is required";
        if (!shippingAddress.city.trim()) newErrors.city = "City is required";
        if (!shippingAddress.country) newErrors.country = "Country is required";
        if (!shippingAddress.state.trim()) newErrors.state = "State is required";
        if (!shippingAddress.zipCode.trim()) newErrors.zipCode = "Zip code is required";
        
        if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";
       
        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (basic)
        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        // Credit card validation if payment method is card
        if (paymentMethod === "stripe") {
            // Validate that all shipping address fields are filled before allowing Stripe payment
            if (!shippingAddress.street.trim()) newErrors.street = "Street address is required for payment";
            if (!shippingAddress.city.trim()) newErrors.city = "City is required for payment";
            if (!shippingAddress.country) newErrors.country = "Country is required for payment";
            if (!shippingAddress.state.trim()) newErrors.state = "State is required for payment";
            if (!shippingAddress.zipCode.trim()) newErrors.zipCode = "Zip code is required for payment";
            
            if (!stripePaymentSuccess) {
                newErrors.stripePayment = "Payment details are required to complete the order.";
            }
        } else if (paymentMethod === "card") {
            if (!bankDetails.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
            if (!bankDetails.cardName.trim()) newErrors.cardName = "Cardholder name is required";
            if (!bankDetails.cardExpiry.trim()) newErrors.cardExpiry = "Expiry date is required";
            if (!bankDetails.cardCvv.trim()) newErrors.cardCvv = "CVV is required";

            // Card number validation (basic)
            if (bankDetails.cardNumber && !/^\d{13,19}$/.test(bankDetails.cardNumber.replace(/\s/g, ""))) {
                newErrors.cardNumber = "Please enter a valid card number";
            }

            // Expiry date validation (MM/YY format)
            if (bankDetails.cardExpiry && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(bankDetails.cardExpiry)) {
                newErrors.cardExpiry = "Please enter expiry date in MM/YY format";
            }

            // CVV validation
            if (bankDetails.cardCvv && !/^\d{3,4}$/.test(bankDetails.cardCvv)) {
                newErrors.cardCvv = "Please enter a valid CVV";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, paymentMethod, bankDetails, shippingAddress, stripePaymentSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // For Stripe payments, we need to handle them differently
        if (paymentMethod === "stripe") {
            if (!stripePaymentSuccess) {
                setErrors({ stripePayment: "Please complete the payment to continue." });
                return;
            }
            // For Stripe, we'll create the order after payment is successful
            // The order creation will be handled by the webhook
            return;
        }

        if (onSubmit) {
            // Prepare the complete form data
            const completeFormData: FormData = {
                ...formData,
                paymentMethod: paymentMethod === "stripe" ? "stripe" : paymentMethod,
                shipToDifferentAddress: shipToDifferentAddress,
                shippingAddress: {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zipCode: shippingAddress.zipCode,
                    country: shippingAddress.country,
                },
                cardNumber: bankDetails.cardNumber,
                cardName: bankDetails.cardName,
                cardExpiry: bankDetails.cardExpiry,
                cardCvv: bankDetails.cardCvv,
            };

            try {
                await onSubmit(completeFormData);
                // Clear saved form data on successful submission
                clearSavedFormData();
            } catch (error) {
                // Don't clear data if submission fails
                // Form submission failed
            }
        }
    };

    const getFieldError = (field: string) => errors[field];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Restoration Notification */}
            {isRestoringData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 text-sm">Restoring your previous form data...</span>
                    </div>
                </div>
            )}
            {/* Billing Information */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input 
                                id="firstName" 
                                placeholder="Your first name" 
                                value={formData.firstName} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} 
                                className={getFieldError("firstName") ? "border-red-500" : ""} 
                            />
                            {getFieldError("firstName") && <p className="text-red-500 text-xs">{getFieldError("firstName")}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input 
                                id="lastName" 
                                placeholder="Your last name" 
                                value={formData.lastName} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} 
                                className={getFieldError("lastName") ? "border-red-500" : ""} 
                            />
                            {getFieldError("lastName") && <p className="text-red-500 text-xs">{getFieldError("lastName")}</p>}
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                        <Label htmlFor="streetAddress">Street Address *</Label>
                        <Input 
                            id="streetAddress" 
                            placeholder="Street address" 
                            value={shippingAddress.street} 
                            onChange={(e) => setShippingAddress((prev) => ({ ...prev, street: e.target.value }))} 
                            className={getFieldError("street") ? "border-red-500" : ""} 
                        />
                        {getFieldError("street") && <p className="text-red-500 text-xs">{getFieldError("street")}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input 
                            id="city" 
                            placeholder="City" 
                            value={shippingAddress.city} 
                            onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))} 
                            className={getFieldError("city") ? "border-red-500" : ""} 
                        />
                        {getFieldError("city") && <p className="text-red-500 text-xs">{getFieldError("city")}</p>}
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <SafeComponent fallback={<Label htmlFor="country">Country / Region *</Label>}>
                                <Label htmlFor="country" className="flex items-center gap-2">
                                    Country / Region *
                                    {isDetecting && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Detecting...
                                        </div>
                                    )}
                                    {detectedLocation && (
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            {detectedLocation.confidence === 'high' ? 'Auto-detected' : 
                                             detectedLocation.confidence === 'medium' ? 'Detected' : 'Best guess'}
                                            {detectedLocation.source && ` (${detectedLocation.source})`}
                                        </div>
                                    )}
                                </Label>
                            </SafeComponent>
                            <Select 
                                value={shippingAddress.country} 
                                onValueChange={(value) => {

                                    setShippingAddress((prev) => {
                                        const newAddress = { ...prev, country: value };

                                        return newAddress;
                                    });
                                }}
                            >
                                <SelectTrigger className={getFieldError("country") ? "border-red-500" : ""}>
                                    <SelectValue placeholder={loadingCountries ? "Loading..." : "Select country"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {countriesError ? (
                                        <div className="p-2 text-red-500 text-sm">{countriesError}</div>
                                    ) : (
                                        countries.map((country) => (
                                            <SelectItem key={country.cca2} value={country.cca2}>
                                                <div className="flex items-center gap-2">
                                                    <span>{country.flag}</span>
                                                    <span>{country.name.common}</span>
                                                    {detectedLocation?.country?.cca2 === country.cca2 && (
                                                        <span className="text-xs text-green-600 ml-auto">✓ Detected</span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {getFieldError("country") && <p className="text-red-500 text-xs">{getFieldError("country")}</p>}
                            <SafeComponent fallback={null}>
                                {detectionError && !detectedLocation && (
                                    <div className="flex items-center gap-2 text-xs text-amber-600">
                                        <span>⚠️</span>
                                        <span>Auto-detection failed. Please select manually.</span>
                                        <button 
                                            type="button" 
                                            onClick={retryDetection}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </SafeComponent>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input 
                                id="state" 
                                placeholder="State" 
                                value={shippingAddress.state} 
                                onChange={(e) => setShippingAddress((prev) => ({ ...prev, state: e.target.value }))} 
                                className={getFieldError("state") ? "border-red-500" : ""} 
                            />
                            {getFieldError("state") && <p className="text-red-500 text-xs">{getFieldError("state")}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code *</Label>
                            <Input 
                                id="zipCode" 
                                placeholder="Zip Code" 
                                value={shippingAddress.zipCode} 
                                onChange={(e) => setShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))} 
                                className={getFieldError("zipCode") ? "border-red-500" : ""} 
                            />
                            {getFieldError("zipCode") && <p className="text-red-500 text-xs">{getFieldError("zipCode")}</p>}
                        </div>
                    </div>

                    {/* Contact Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Email Address" 
                                value={formData.email} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} 
                                className={getFieldError("email") ? "border-red-500" : ""} 
                            />
                            {getFieldError("email") && <p className="text-red-500 text-xs">{getFieldError("email")}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="Phone number" 
                                value={formData.phone} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} 
                                className={getFieldError("phone") ? "border-red-500" : ""} 
                            />
                            {getFieldError("phone") && <p className="text-red-500 text-xs">{getFieldError("phone")}</p>}
                        </div>
                    </div>

                    {/* Ship to Different Address */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                            id="shipToDifferentAddress" 
                            checked={shipToDifferentAddress} 
                            onCheckedChange={(checked) => setShipToDifferentAddress(checked === true)} 
                        />
                        <Label htmlFor="shipToDifferentAddress" className="text-sm">
                            Ship to a different address
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <label key={method.value} className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value={method.value} 
                                    checked={paymentMethod === method.value} 
                                    onChange={() => setPaymentMethod(method.value)} 
                                    className="h-4 w-4 border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{method.label}</div>
                                    <div className="text-sm text-gray-500">{method.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    {getFieldError("paymentMethod") && <p className="text-red-500 text-xs mt-2">{getFieldError("paymentMethod")}</p>}
                </CardContent>
            </Card>

            {/* Credit Card Form (Conditional) */}
            {paymentMethod === "stripe" && (
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {/* Check if all required fields are filled before showing Stripe payment */}
                        {shippingAddress.street && 
                         shippingAddress.city && 
                         shippingAddress.state && 
                         shippingAddress.zipCode && 
                         (shippingAddress.country || detectedLocation?.country?.cca2) && 
                         formData.firstName && 
                         formData.lastName && 
                         formData.email && 
                         formData.phone ? (
                            <StripePaymentSection 
                                amount={calculateOrderTotal()}
                                customerEmail={user.email || ''}
                                customerName={user.name || ''}
                                cartItems={cartItems}
                                shippingAddress={{
                                    ...shippingAddress,
                                    country: shippingAddress.country || detectedLocation?.country?.cca2 || ''
                                }}
                                user={user}
                                onPaymentSuccess={(paymentIntentId) => {
                                    setStripePaymentSuccess(true);
                                    setOrderId(paymentIntentId);
                                }}
                                onPaymentError={(error) => {
                                    setStripePaymentError(error);
                                }}
                                onPaymentCancel={() => {
                                    setStripePaymentError('Payment was cancelled');
                                }}
                            />
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                                <div className="flex items-center gap-2">
                                    <span>⚠️</span>
                                    <div>
                                        <p className="font-medium">Complete Required Fields</p>
                                        <p className="text-sm">Please fill in all required shipping and billing information above before proceeding with payment.</p>
                                        <div className="mt-2 text-xs">
                                            Missing fields: {[
                                                !formData.firstName && 'First Name',
                                                !formData.lastName && 'Last Name', 
                                                !formData.email && 'Email',
                                                !formData.phone && 'Phone',
                                                !shippingAddress.street && 'Street Address',
                                                !shippingAddress.city && 'City',
                                                !shippingAddress.state && 'State',
                                                !shippingAddress.zipCode && 'Zip Code',
                                                !shippingAddress.country && 'Country'
                                            ].filter(Boolean).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {stripePaymentError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                                <p>{stripePaymentError}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
            {paymentMethod === "card" && (
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input 
                                id="cardNumber" 
                                placeholder="1234 5678 9012 3456" 
                                value={bankDetails.cardNumber} 
                                onChange={(e) => setBankDetails((prev) => ({ ...prev, cardNumber: e.target.value }))} 
                                className={getFieldError("cardNumber") ? "border-red-500" : ""} 
                                maxLength={19} 
                            />
                            {getFieldError("cardNumber") && <p className="text-red-500 text-xs">{getFieldError("cardNumber")}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name *</Label>
                            <Input 
                                id="cardName" 
                                placeholder="John Doe" 
                                value={bankDetails.cardName} 
                                onChange={(e) => setBankDetails((prev) => ({ ...prev, cardName: e.target.value }))} 
                                className={getFieldError("cardName") ? "border-red-500" : ""} 
                            />
                            {getFieldError("cardName") && <p className="text-red-500 text-xs">{getFieldError("cardName")}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiry Date *</Label>
                                <Input 
                                    id="cardExpiry" 
                                    placeholder="MM/YY" 
                                    value={bankDetails.cardExpiry} 
                                    onChange={(e) => setBankDetails((prev) => ({ ...prev, cardExpiry: e.target.value }))} 
                                    className={getFieldError("cardExpiry") ? "border-red-500" : ""} 
                                    maxLength={5} 
                                />
                                {getFieldError("cardExpiry") && <p className="text-red-500 text-xs">{getFieldError("cardExpiry")}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cardCvv">CVV *</Label>
                                <Input 
                                    id="cardCvv" 
                                    placeholder="123" 
                                    value={bankDetails.cardCvv} 
                                    onChange={(e) => setBankDetails((prev) => ({ ...prev, cardCvv: e.target.value }))} 
                                    className={getFieldError("cardCvv") ? "border-red-500" : ""} 
                                    maxLength={4} 
                                />
                                {getFieldError("cardCvv") && <p className="text-red-500 text-xs">{getFieldError("cardCvv")}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Additional Info */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">Additional Info</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                        <Textarea 
                            id="orderNotes" 
                            placeholder="Notes about your order, e.g. special notes for delivery" 
                            value={formData.orderNotes} 
                            onChange={(e) => setFormData((prev) => ({ ...prev, orderNotes: e.target.value }))} 
                            rows={4} 
                            className="resize-none" 
                        />
                    </div>
                </CardContent>
            </Card>



            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-lg"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing Order...
                        </>
                    ) : (
                        "Place Order"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CheckoutForm;
