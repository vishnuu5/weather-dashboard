import { useWeather } from "../context/WeatherContext"
import { Calendar, Thermometer } from "lucide-react"

function ForecastDisplay() {
    const { forecast, convertTemperature } = useWeather()

    if (!forecast) {
        return (
            <div className="weather-card text-center">
                <p className="text-white/80">Search for a city to see 5-day forecast</p>
            </div>
        )
    }

    // Group forecast by day (every 8th item represents a new day)
    const dailyForecasts = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5)

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="weather-card">
            <div className="flex items-center space-x-2 mb-6">
                <Calendar className="text-white" size={24} />
                <h2 className="text-2xl font-bold text-black">5-Day Forecast</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {dailyForecasts.map((day, index) => (
                    <div key={index} className="glass-effect bg-pink-400 p-4 text-center">
                        <p className="text-white/100 text-sm mb-2">{index === 0 ? "Today" : formatDate(day.dt)}</p>

                        <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                            className="w-16 h-16 mx-auto mb-2"
                        />

                        <p className="text-white text-sm capitalize mb-2">{day.weather[0].description}</p>

                        <div className="flex items-center justify-center space-x-1 mb-2">
                            <Thermometer size={16} className="text-blue-300" />
                            <span className="text-white font-semibold">{convertTemperature(day.main.temp)}°</span>
                        </div>

                        <div className="text-xs text-white/100">
                            <p>H: {convertTemperature(day.main.temp_max)}°</p>
                            <p>L: {convertTemperature(day.main.temp_min)}°</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ForecastDisplay
