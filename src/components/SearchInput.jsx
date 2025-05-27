import { useState } from "react"
import { useWeather } from "../context/WeatherContext"
import { useAuth } from "../context/AuthContext"
import { Search, MapPin } from "lucide-react"

function SearchInput() {
    const [city, setCity] = useState("")
    const { fetchCurrentWeather, fetchForecast, lastSearchedCity } = useWeather()
    const { saveWeatherData } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!city.trim()) return

        try {
            const weatherData = await fetchCurrentWeather(city)
            await fetchForecast(city)
            await saveWeatherData(weatherData)
            setCity("")
        } catch (error) {
            console.error("Error fetching weather:", error)
        }
    }

    return (
        <div className="weather-card">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                    />
                </div>

                <button type="submit" className="btn-primary flex items-center justify-center space-x-2 px-6">
                    <Search size={20} />
                    <span>Search</span>
                </button>
            </form>

            {lastSearchedCity && (
                <p className="text-black/80 text-sm mt-3">
                    Last searched: <span className="font-semibold text-red-600">{lastSearchedCity}</span>
                </p>
            )}
        </div>
    )
}

export default SearchInput
