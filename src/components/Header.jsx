

import { useAuth } from "../context/AuthContext"
import { useWeather } from "../context/WeatherContext"
import { LogOut, Thermometer, User } from "lucide-react"

function Header() {
    const { user, signOut, isDemo } = useAuth()
    const { temperatureUnit, toggleTemperatureUnit } = useWeather()

    const handleSignOut = async () => {
        await signOut()
    }

    const getUserDisplayName = () => {
        if (user?.name) return user.name
        if (user?.user_metadata?.name) return user.user_metadata.name
        if (user?.email) return user.email.split("@")[0]
        return "User"
    }

    return (
        <header className="weather-card mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">Weather Dashboard</h1>
                    <div className="flex items-center space-x-2">
                        <User size={16} className="text-black/90" />
                        <p className="text-black/90">
                            Welcome back, {getUserDisplayName()}
                            {isDemo && <span className="ml-2 text-yellow-300 text-sm">(Demo)</span>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={toggleTemperatureUnit} className="btn-secondary flex items-center space-x-2">
                        <Thermometer size={20} />
                        <span>°{temperatureUnit === "celsius" ? "C" : "F"}</span>
                    </button>

                    <button onClick={handleSignOut} className="btn-secondary flex items-center space-x-2">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
