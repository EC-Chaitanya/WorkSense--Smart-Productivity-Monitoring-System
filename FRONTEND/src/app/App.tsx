import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { ModeProvider } from "./context/ModeContext";

export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <RouterProvider router={router} />
      </ModeProvider>
    </ThemeProvider>
  );
}
