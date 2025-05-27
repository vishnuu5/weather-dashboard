
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff, Mail, Lock, Cloud, AlertCircle, CheckCircle, User, Play } from "lucide-react"

function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const { signIn, signUp, loginWithDemo, hasSupabase } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        try {
            const { data, error } = isLogin ? await signIn(email, password) : await signUp(email, password, name)

            if (error) {
                setError(error.message)
            } else {
                if (!isLogin) {
                    setSuccess(
                        hasSupabase
                            ? "Account created successfully! Please check your email for confirmation."
                            : "Account created successfully! You can now sign in.",
                    )
                    if (!hasSupabase) {
                        // For demo mode, clear form and switch to login
                        setEmail("")
                        setPassword("")
                        setName("")
                    } else {
                        setIsLogin(true)
                        setPassword("")
                    }
                }
            }
        } catch (err) {
            console.error("Auth error:", err)
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const { data, error } = await loginWithDemo()
            if (error) {
                setError(error.message)
            } else {
                setSuccess("Demo login successful! All features are available.")
            }
        } catch (err) {
            console.error("Demo login error:", err)
            setError("Demo login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const switchMode = () => {
        setIsLogin(!isLogin)
        setError("")
        setSuccess("")
        setPassword("")
        setName("")
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="weather-card w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Cloud className="text-white" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-black mb-2">Weather Dashboard</h1>
                    <p className="text-white/80">{isLogin ? "Sign in to your account" : "Create a new account"}</p>

                    {/* Show mode indicator */}
                    {!hasSupabase && (
                        <div className="mt-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full inline-block">
                            <span className="text-yellow-300 text-sm">🟡 Demo Mode Active</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start space-x-2">
                        <AlertCircle className="text-red-300 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start space-x-2">
                        <CheckCircle className="text-green-300 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-green-300 text-sm">{success}</p>
                    </div>
                )}

                {/* Show helpful info for demo mode */}
                {!hasSupabase && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <p className="text-blue-300 text-sm mb-2">💡 Demo Mode Info:</p>
                        <ul className="text-blue-300 text-xs space-y-1">
                            <li>• Use any email/password to create accounts</li>
                            <li>• All data saved locally in your browser</li>
                            <li>• Full weather functionality available</li>
                            <li>• No email confirmation required</li>
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name (optional)"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={hasSupabase ? "Email address" : "Any email (e.g., user@example.com)"}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (min 6 characters)"
                            required
                            minLength={6}
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/30 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                {/* Demo Login Button */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-black/80">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="w-full mt-4 btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={18} />
                        <span>Login with Demo</span>
                    </button>
                    <p className="text-white/60 text-xs text-center mt-2">Try the app instantly without creating an account</p>
                </div>

                <div className="mt-6 text-center">
                    <button onClick={switchMode} className="text-white/80 hover:text-white transition-colors">
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>

                {/* Configuration status */}
               {/* <div className="mt-4 text-xs text-white/60 text-center space-y-1">
                    <p>Weather API: {import.meta.env.VITE_OPENWEATHER_API_KEY ? "✅ Configured" : "❌ Not configured"}</p>
                    <p>Backend: {hasSupabase ? "✅ Cloud" : "🟡 Demo Mode"}</p>
                </div> */}
            </div>
        </div>
    )
}

export default LoginForm
