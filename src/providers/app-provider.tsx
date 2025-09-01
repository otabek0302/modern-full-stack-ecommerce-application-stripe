"use client";

import React from "react";
import { StateProvider } from "../contexts/state-context";
import { UserProvider } from "../contexts/user-context";
import { ServerSyncWrapper } from "./server-sync-wrapper";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <StateProvider>
                <ServerSyncWrapper>
                    {children}
                </ServerSyncWrapper>
            </StateProvider>
        </UserProvider>
    );
};
