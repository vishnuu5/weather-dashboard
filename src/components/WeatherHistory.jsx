import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useWeather } from "../context/WeatherContext"
import { History, MapPin, Thermometer, Clock } from "lucide-react"

function WeatherHistory() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const { getWeatherHistory, isDemo } = useAuth()
    const { convertTemperature, temperatureUnit } = useWeather()

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        setLoading(true)
        try {
            const { data, error } = await getWeatherHistory()
            if (!error && data) {
                setHistory(data)
            }
        } catch (error) {
            console.error("Failed to load history:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="weather-card">
                <div className="flex items-center space-x-2 mb-4">
                    <History className="text-white" size={20} />
                    <h3 className="text-lg font-semibold text-white">Search History</h3>
                </div>
                <p className="text-white/80">Loading...</p>
            </div>
        )
    }

    return (
        <div className="weather-card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <History className="text-black" size={20} />
                    <h3 className="text-lg font-semibold text-black">Search History</h3>
                </div>
                {isDemo && (
                    <span className="text-yellow-300 text-xs px-2 py-1 bg-yellow-500/20 rounded-full">Local Storage</span>
                )}
            </div>

            {history.length === 0 ? (
                <p className="text-black/80 text-center py-4">No search history yet. Search for a city to get started!</p>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.map((search, index) => (
                        <div key={search.id || index} className="glass-effect p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-rose-700" />
                                    <span className="text-black font-medium">{search.city}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-black/80 text-sm">
                                    <Thermometer size={14} />
                                    <span>
                                        {convertTemperature(search.temperature)}°{temperatureUnit === "celsius" ? "C" : "F"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-sm text-black/60">
                                <span className="capitalize">{search.description}</span>
                                <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>{formatDate(search.searched_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WeatherHistory
