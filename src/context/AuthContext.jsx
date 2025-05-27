

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Check if environment variables are loaded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create Supabase client if we have VALID credentials
let supabase = null
let supabaseWorking = false

if (supabaseUrl && supabaseKey && supabaseUrl !== "your_supabase_url_here") {
    try {
        supabase = createClient(supabaseUrl, supabaseKey)
        console.log("✅ Supabase client created")
    } catch (error) {
        console.error("❌ Failed to create Supabase client:", error)
    }
}

const AuthContext = createContext()

// Demo user storage keys
const DEMO_USERS_KEY = "weather_demo_users"
const DEMO_CURRENT_USER_KEY = "weather_demo_current_user"

// Helper functions for demo mode
const getDemoUsers = () => {
    const users = localStorage.getItem(DEMO_USERS_KEY)
    return users ? JSON.parse(users) : []
}

const saveDemoUsers = (users) => {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

const getCurrentDemoUser = () => {
    const user = localStorage.getItem(DEMO_CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
}

const setCurrentDemoUser = (user) => {
    if (user) {
        localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(user))
    } else {
        localStorage.removeItem(DEMO_CURRENT_USER_KEY)
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDemo, setIsDemo] = useState(false)

    useEffect(() => {
        // Check for existing demo user first
        const demoUser = getCurrentDemoUser()
        if (demoUser) {
            setUser(demoUser)
            setIsDemo(true)
            setLoading(false)
            console.log("🟡 Restored demo user session:", demoUser.email)
            return
        }

        // Test Supabase connection
        const testSupabase = async () => {
            if (!supabase) {
                console.log("🟡 No Supabase - using demo mode")
                setLoading(false)
                return
            }

            try {
                // Test if Supabase is working by checking auth
                const { data, error } = await supabase.auth.getUser()

                if (error && error.name !== "AuthSessionMissingError") {
                    console.log("🟡 Supabase connection issues - using demo mode")
                    supabaseWorking = false
                } else {
                    console.log("✅ Supabase connection working")
                    supabaseWorking = true
                    if (data.user) {
                        setUser(data.user)
                        setIsDemo(false)
                    }
                }
            } catch (error) {
                console.log("🟡 Supabase error - using demo mode:", error.message)
                supabaseWorking = false
            } finally {
                setLoading(false)
            }
        }

        testSupabase()

        // Only set up auth listener if Supabase is working
        if (supabase) {
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((event, session) => {
                if (supabaseWorking) {
                    console.log("🔄 Auth state changed:", event)
                    if (session?.user) {
                        setUser(session.user)
                        setIsDemo(false)
                    } else {
                        setUser(null)
                    }
                }
                setLoading(false)
            })

            return () => subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email, password) => {
        // Always try demo mode first if Supabase isn't working
        if (!supabase || !supabaseWorking) {
            console.log("🟡 Using demo mode for sign in:", email)
            const demoUsers = getDemoUsers()
            const user = demoUsers.find((u) => u.email === email && u.password === password)

            if (user) {
                const userWithoutPassword = { ...user }
                delete userWithoutPassword.password
                setUser(userWithoutPassword)
                setCurrentDemoUser(userWithoutPassword)
                setIsDemo(true)
                console.log("✅ Demo sign in successful:", email)
                return { data: { user: userWithoutPassword }, error: null }
            } else {
                return { data: null, error: { message: "Invalid email or password. Try creating an account first." } }
            }
        }

        // Try Supabase if it's working
        try {
            setLoading(true)
            console.log("🔵 Attempting Supabase sign in for:", email)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error("❌ Supabase sign in error:", error)
                // Fall back to demo mode on error
                console.log("🟡 Falling back to demo mode")
                supabaseWorking = false
                return await signIn(email, password) // Retry with demo mode
            } else {
                console.log("✅ Supabase sign in successful:", data.user?.email)
                setIsDemo(false)
                return { data, error }
            }
        } catch (error) {
            console.error("❌ Supabase sign in failed:", error)
            // Fall back to demo mode
            supabaseWorking = false
            return await signIn(email, password)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password, name = "") => {
        // Always use demo mode if Supabase isn't working or for common email issues
        if (!supabase || !supabaseWorking) {
            console.log("🟡 Using demo mode for sign up:", email)
            const demoUsers = getDemoUsers()

            // Check if user already exists
            if (demoUsers.find((u) => u.email === email)) {
                return { data: null, error: { message: "User with this email already exists. Try signing in." } }
            }

            // Create new demo user
            const newUser = {
                id: `demo-${Date.now()}`,
                email,
                password, // In real app, this would be hashed
                name: name || email.split("@")[0],
                created_at: new Date().toISOString(),
            }

            demoUsers.push(newUser)
            saveDemoUsers(demoUsers)

            const userWithoutPassword = { ...newUser }
            delete userWithoutPassword.password

            setUser(userWithoutPassword)
            setCurrentDemoUser(userWithoutPassword)
            setIsDemo(true)

            console.log("✅ Demo sign up successful:", email)
            return { data: { user: userWithoutPassword }, error: null }
        }

        // Try Supabase if it's working
        try {
            setLoading(true)
            console.log("🔵 Attempting Supabase sign up for:", email)

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        name: name || email.split("@")[0],
                    },
                },
            })

            if (error) {
                console.error("❌ Supabase sign up error:", error)
                // Fall back to demo mode on any error
                console.log("🟡 Falling back to demo mode due to Supabase error")
                supabaseWorking = false
                return await signUp(email, password, name) // Retry with demo mode
            } else {
                console.log("✅ Supabase sign up successful:", data.user?.email)
                setIsDemo(false)
                return { data, error }
            }
        } catch (error) {
            console.error("❌ Supabase sign up failed:", error)
            // Fall back to demo mode
            supabaseWorking = false
            return await signUp(email, password, name)
        } finally {
            setLoading(false)
        }
    }

    const loginWithDemo = async () => {
        console.log("🟡 Demo login - creating demo user")

        // Create a demo user
        const demoUser = {
            id: `demo-${Date.now()}`,
            email: "demo@example.com",
            name: "Demo User",
            created_at: new Date().toISOString(),
        }

        setUser(demoUser)
        setCurrentDemoUser(demoUser)
        setIsDemo(true)
        setLoading(false)

        console.log("✅ Demo login successful")
        return { data: { user: demoUser }, error: null }
    }

    const signOut = async () => {
        // Demo mode sign out
        if (isDemo) {
            console.log("🟡 Demo mode sign out")
            setUser(null)
            setIsDemo(false)
            setCurrentDemoUser(null)
            return { error: null }
        }

        // Supabase sign out
        if (supabase && supabaseWorking) {
            try {
                setLoading(true)
                console.log("🔵 Supabase sign out")
                const { error } = await supabase.auth.signOut()
                if (!error) {
                    setUser(null)
                    setIsDemo(false)
                }
                return { error }
            } catch (error) {
                console.error("❌ Sign out failed:", error)
                return { error: { message: "Failed to sign out" } }
            } finally {
                setLoading(false)
            }
        } else {
            setUser(null)
            return { error: null }
        }
    }

    const saveWeatherData = async (weatherData) => {
        if (!user) return { data: null, error: null }

        // Always save to localStorage (works for both demo and real users)
        const searches = JSON.parse(localStorage.getItem(`weather_searches_${user.id}`) || "[]")
        const newSearch = {
            id: Date.now(),
            user_id: user.id,
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            searched_at: new Date().toISOString(),
        }
        searches.unshift(newSearch)
        searches.splice(10) // Keep only last 10 searches
        localStorage.setItem(`weather_searches_${user.id}`, JSON.stringify(searches))

        console.log("💾 Weather data saved:", weatherData.name)

        // Also try to save to Supabase if available and working (but don't fail if it doesn't work)
        if (supabase && supabaseWorking && !isDemo) {
            try {
                await supabase.from("weather_searches").insert([
                    {
                        user_id: user.id,
                        city: weatherData.name,
                        temperature: weatherData.main.temp,
                        description: weatherData.weather[0].description,
                        searched_at: new Date().toISOString(),
                    },
                ])
                console.log("☁️ Weather data also saved to cloud")
            } catch (error) {
                console.log("⚠️ Cloud save failed, but local save succeeded")
            }
        }

        return { data: [newSearch], error: null }
    }

    const getWeatherHistory = async () => {
        if (!user) return { data: [], error: null }

        // Always get from localStorage (works for both demo and real users)
        const searches = JSON.parse(localStorage.getItem(`weather_searches_${user.id}`) || "[]")
        return { data: searches, error: null }
    }

    const value = {
        user,
        loading,
        isDemo,
        hasSupabase: !!supabase && supabaseWorking,
        signIn,
        signUp,
        signOut,
        loginWithDemo,
        saveWeatherData,
        getWeatherHistory,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
