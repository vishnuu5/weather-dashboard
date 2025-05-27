import { Loader2 } from "lucide-react"

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center space-x-2">
            <Loader2 className="animate-spin text-white" size={24} />
            <span className="text-white">Loading weather data...</span>
        </div>
    )
}

export default LoadingSpinner
