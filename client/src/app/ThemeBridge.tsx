"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import { getDocumentTheme } from "@/lib/theme";

export default function ThemeBridge() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsDarkMode(getDocumentTheme() === "dark"));
  }, [dispatch]);

  return null;
}
