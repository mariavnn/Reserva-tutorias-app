import { vars } from "nativewind";

export const themes = {
  light: vars({
    "--color-background": "#F0F2F5",
    "--color-border": "#E8E8E8",
    "--color-text-primary": "rgba(0, 0, 0, 0.8)",
    "--color-text-seconday": "rgba(0, 0, 0, 0.6)",
    "--color-text-terciary": "rgba(0, 0, 0, 0.3)",

    "--color-primary-light": "#2673DD",
    "--color-secondary-light": "rgba(38, 115, 221, 0.2)",
    "--color-tertiary-light": "rgba(38, 115, 221, 0.05)",
  }),
  dark: vars({
    "--color-background": "rgba(18, 18, 18, 0.9)",
    "--color-border": "rgba(255, 255, 255, 0.09)",
    "--color-text-primary": "rgba(255, 255, 255, 0.8)",
    "--color-text-secondary": "rgba(255, 255, 255, 0.6)",
    "--color-text-terciary": "rgba(255, 255, 255, 0.3)",

    "--color-primary-dark": "#2673DD",
    "--color-secondary-dark": "rgba(38, 115, 221, 0.3)",
    "--color-tertiary-dark": "rgba(38, 115, 221, 0.14)",
  }),
};