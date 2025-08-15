"use client";

import React from "react";
import { StateProvider } from "../contexts/state-context";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return <StateProvider>{children}</StateProvider>;
};
