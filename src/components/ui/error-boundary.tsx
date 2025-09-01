"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log the error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="border-b border-red-200 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-red-900">
                                Something went wrong
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <p className="text-red-800">
                            We encountered an error while loading this section. Please try refreshing the page.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                                <h4 className="font-medium text-red-900 mb-2">Error Details (Development Only):</h4>
                                <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-x-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && (
                                        <>
                                            {'\n\nComponent Stack:'}
                                            {this.state.errorInfo.componentStack}
                                        </>
                                    )}
                                </pre>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button 
                                onClick={this.handleReset}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components
export function useErrorBoundary() {
    const [error, setError] = React.useState<Error | null>(null);

    const resetError = React.useCallback(() => {
        setError(null);
    }, []);

    const captureError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return { captureError, resetError };
}

// Simple wrapper component
export function SafeComponent({ 
    children, 
    fallback 
}: { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
}) {
    return (
        <ErrorBoundary fallback={fallback}>
            {children}
        </ErrorBoundary>
    );
}
