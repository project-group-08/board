"use client";

import { createContext } from "react";

export type ModalCoordinator = {
  enter: () => () => void;
};

export const ModalContext = createContext<ModalCoordinator | null>(null);
