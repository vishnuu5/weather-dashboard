import { useQuery } from "@tanstack/react-query";

const API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  "8c8e1063e4b6b8bb54b4c35b5c63c7a8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      if (!city) return null;

      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      return response.json();
    },
    enabled: !!city,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

export const useForecast = (city) => {
  return useQuery({
    queryKey: ["forecast", city],
    queryFn: async () => {
      if (!city) return null;

      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      return response.json();
    },
    enabled: !!city,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};
