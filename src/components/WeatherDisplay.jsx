import { useWeather } from "../context/WeatherContext"
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, MapPin } from "lucide-react"

function WeatherDisplay() {
    const { currentWeather, convertTemperature, temperatureUnit } = useWeather()

    if (!currentWeather) {
        return (
            <div className="weather-card text-center">
                <p className="text-white/80">Search for a city to see current weather</p>
            </div>
        )
    }

    const {
        name,
        main: { temp, feels_like, humidity, pressure },
        weather: [{ description, icon }],
        wind: { speed },
        visibility,
        sys: { sunrise, sunset },
    } = currentWeather

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Weather Card */}
            <div className="lg:col-span-2 weather-card">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <MapPin size={20} className="text-yellow/100" />
                            <h2 className="text-2xl font-bold text-black">{name}</h2>
                        </div>
                        <p className="text-black/100 capitalize">{description}</p>
                    </div>

                    <div className="text-right">
                        <img src={`https://openweathermap.org/img/wn/${icon}@4x.png`} alt={description} className="w-24 h-24" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="text-6xl font-bold text-white mb-2">{convertTemperature(temp)}°</div>
                        <p className="text-white/80">
                            Feels like {convertTemperature(feels_like)}°{temperatureUnit === "celsius" ? "C" : "F"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Droplets className="text-red-600" size={20} />
                            <span className="text-white">Humidity: {humidity}%</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Wind className="text-amber-400" size={20} />
                            <span className="text-white">Wind: {speed} m/s</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Gauge className="text-blue-800" size={20} />
                            <span className="text-white">Pressure: {pressure} hPa</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Card */}
            <div className="weather-card">
                <h3 className="text-xl font-semibold text-white mb-4">Additional Info</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Eye className="text-blue-800" size={18} />
                            <span className="text-white/80">Visibility</span>
                        </div>
                        <span className="text-white font-semibold">{(visibility / 1000).toFixed(1)} km</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sunrise className="text-yellow-400" size={18} />
                            <span className="text-white/80">Sunrise</span>
                        </div>
                        <span className="text-white font-semibold">{formatTime(sunrise)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sunset className="text-orange-600" size={18} />
                            <span className="text-white/80">Sunset</span>
                        </div>
                        <span className="text-white font-semibold">{formatTime(sunset)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherDisplay
