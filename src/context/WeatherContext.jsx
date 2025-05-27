import { createContext, useContext, useReducer, useEffect } from "react"

const WeatherContext = createContext()

const initialState = {
    currentWeather: null,
    forecast: null,
    loading: false,
    error: null,
    lastSearchedCity: localStorage.getItem("lastSearchedCity") || "",
    temperatureUnit: localStorage.getItem("temperatureUnit") || "celsius",
}

function weatherReducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload, error: null }
        case "SET_CURRENT_WEATHER":
            return { ...state, currentWeather: action.payload, loading: false, error: null }
        case "SET_FORECAST":
            return { ...state, forecast: action.payload, loading: false, error: null }
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false }
        case "SET_LAST_SEARCHED_CITY":
            localStorage.setItem("lastSearchedCity", action.payload)
            return { ...state, lastSearchedCity: action.payload }
        case "SET_TEMPERATURE_UNIT":
            localStorage.setItem("temperatureUnit", action.payload)
            return { ...state, temperatureUnit: action.payload }
        default:
            return state
    }
}

export function WeatherProvider({ children }) {
    const [state, dispatch] = useReducer(weatherReducer, initialState)

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "8c8e1063e4b6b8bb54b4c35b5c63c7a8"
    const BASE_URL = "https://api.openweathermap.org/data/2.5"

    const fetchCurrentWeather = async (city) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)

            if (!response.ok) {
                throw new Error("City not found")
            }

            const data = await response.json()
            dispatch({ type: "SET_CURRENT_WEATHER", payload: data })
            dispatch({ type: "SET_LAST_SEARCHED_CITY", payload: city })
            return data
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message })
            throw error
        }
    }

    const fetchForecast = async (city) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`)

            if (!response.ok) {
                throw new Error("City not found")
            }

            const data = await response.json()
            dispatch({ type: "SET_FORECAST", payload: data })
            return data
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message })
            throw error
        }
    }

    const toggleTemperatureUnit = () => {
        const newUnit = state.temperatureUnit === "celsius" ? "fahrenheit" : "celsius"
        dispatch({ type: "SET_TEMPERATURE_UNIT", payload: newUnit })
    }

    const convertTemperature = (temp) => {
        if (state.temperatureUnit === "fahrenheit") {
            return Math.round((temp * 9) / 5 + 32)
        }
        return Math.round(temp)
    }

    // Load last searched city on mount
    useEffect(() => {
        if (state.lastSearchedCity) {
            fetchCurrentWeather(state.lastSearchedCity).catch(() => { })
            fetchForecast(state.lastSearchedCity).catch(() => { })
        }
    }, [])

    const value = {
        ...state,
        fetchCurrentWeather,
        fetchForecast,
        toggleTemperatureUnit,
        convertTemperature,
        clearError: () => dispatch({ type: "SET_ERROR", payload: null }),
    }

    return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export const useWeather = () => {
    const context = useContext(WeatherContext)
    if (!context) {
        throw new Error("useWeather must be used within a WeatherProvider")
    }
    return context
}
