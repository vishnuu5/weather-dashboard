

import { useWeather } from "../context/WeatherContext"
import { AlertCircle, X } from "lucide-react"

function ErrorDisplay() {
    const { error, clearError } = useWeather()

    if (!error) return null

    return (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <AlertCircle className="text-red-300" size={24} />
                    <div>
                        <h3 className="text-white font-semibold">Error</h3>
                        <p className="text-white/80">{error}</p>
                    </div>
                </div>

                <button onClick={clearError} className="text-white/80 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}

export default ErrorDisplay
