import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { ModeProvider } from "./context/ModeContext";
import { SessionProvider } from "./context/SessionContext";

export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}
