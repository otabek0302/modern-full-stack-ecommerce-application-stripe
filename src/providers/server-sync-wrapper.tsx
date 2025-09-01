"use client";

import React from 'react';
import { useServerSync } from '@/hooks/useServerSync';

interface ServerSyncWrapperProps {
    children: React.ReactNode;
}

export const ServerSyncWrapper: React.FC<ServerSyncWrapperProps> = ({ children }) => {
    // This hook will automatically sync cart and wishlist with server when user logs in
    useServerSync();

    return <>{children}</>;
};
