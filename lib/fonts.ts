export type FontWeight = "Regular" | "SemiBold" | "Bold";
export type FontFamily = "Montserrat" | "Poppins" | "Roboto" | "Great Vibes";

export interface FontConfig {
  family: FontFamily;
  weight: FontWeight;
  file: string;
}

export const FONT_CONFIGS: FontConfig[] = [
  { family: "Montserrat", weight: "Regular", file: "Montserrat-Regular.ttf" },
  { family: "Montserrat", weight: "SemiBold", file: "Montserrat-SemiBold.ttf" },
  { family: "Montserrat", weight: "Bold", file: "Montserrat-Bold.ttf" },
  { family: "Poppins", weight: "Regular", file: "Poppins-Regular.ttf" },
  { family: "Poppins", weight: "SemiBold", file: "Poppins-SemiBold.ttf" },
  { family: "Poppins", weight: "Bold", file: "Poppins-Bold.ttf" },
  { family: "Roboto", weight: "Regular", file: "Roboto-Regular.ttf" },
  { family: "Roboto", weight: "SemiBold", file: "Roboto-SemiBold.ttf" },
  { family: "Roboto", weight: "Bold", file: "Roboto-Bold.ttf" },
  { family: "Great Vibes", weight: "Regular", file: "GreatVibes-Regular.ttf" },
];

export const getAvailableWeights = (fontFamily: FontFamily): FontWeight[] => {
  if (fontFamily === "Great Vibes") return ["Regular"];
  return ["Regular", "SemiBold", "Bold"];
};

export const getFontFile = (fontFamily: FontFamily, weight: FontWeight): string => {
  const config = FONT_CONFIGS.find((f) => f.family === fontFamily && f.weight === weight);
  return config?.file || "Montserrat-Regular.ttf";
};

export const normalizeWeightForFamily = (family: FontFamily, weight: FontWeight): FontWeight => {
  if (family === "Great Vibes") return "Regular";
  return weight;
};

export const hexToRgb01 = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
};
