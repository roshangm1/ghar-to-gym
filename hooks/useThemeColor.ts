import { useColorScheme } from "react-native";
import Colors from "@/constants/colors";

export function useThemeColor() {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? Colors.dark : Colors.light;
}

