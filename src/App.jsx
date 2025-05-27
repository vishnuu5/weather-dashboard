import { useState } from "react"
import { useAuth } from "./context/AuthContext"
import Header from "./components/Header"
import SearchInput from "./components/SearchInput"
import WeatherDisplay from "./components/WeatherDisplay"
import ForecastDisplay from "./components/ForecastDisplay"
import WeatherHistory from "./components/WeatherHistory"
import ErrorDisplay from "./components/ErrorDisplay"
import LoadingSpinner from "./components/LoadingSpinner"
import LoginForm from "./components/LoginForm"
import { useWeather } from "./context/WeatherContext"

function App() {
  const { user, loading: authLoading } = useAuth()
  const { loading, error } = useWeather()
  const [activeTab, setActiveTab] = useState("current")

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="mb-8">
          <SearchInput />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorDisplay />
          </div>
        )}

        {loading && (
          <div className="flex justify-center mb-6">
            <LoadingSpinner />
          </div>
        )}

        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === "current" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              Current Weather
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === "forecast" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              5-Day Forecast
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === "history" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              Search History
            </button>
          </div>

          {activeTab === "current" && <WeatherDisplay />}
          {activeTab === "forecast" && <ForecastDisplay />}
          {activeTab === "history" && <WeatherHistory />}
        </div>
      </div>
    </div>
  )
}

export default App
