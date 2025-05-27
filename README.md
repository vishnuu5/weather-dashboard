# Weather Dashboard

A modern, responsive weather dashboard built with React.js, featuring real-time weather data, 5-day forecasts, and user authentication.

## 🌟 Features

### Core Features

- **Real-time Weather Data**: Current weather conditions for any city
- **5-Day Forecast**: Extended weather predictions
- **Auto-refresh**: Data updates every 30 seconds
- **Local Storage**: Remembers last searched city
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Responsive Design**: Works on all device sizes

### Bonus Features

- **User Authentication**: Supabase integration for login/signup
- **Data Caching**: React Query for efficient API calls
- **Weather History**: Save and view previous searches
- **Modern UI**: Glass morphism design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/vishnuu5/weather-dashboard.git
cd weather-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```bash
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Get API Keys**

   - **OpenWeatherMap**: Sign up at [openweathermap.org](https://openweathermap.org/api)
   - **Supabase** (optional): Create project at [supabase.com](https://supabase.com)

5. **Start development server**

```bash
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Technologies Used

- **Frontend Framework**: React.js 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Data Fetching**: React Query (@tanstack/react-query)
- **Authentication**: Supabase
- **Weather API**: OpenWeatherMap
- **Icons**: Lucide React

## 📱 Usage

### Basic Usage

1. **Search for a city**: Enter city name in the search bar
2. **View current weather**: See temperature, humidity, wind speed, etc.
3. **Check forecast**: Switch to 5-day forecast tab
4. **Toggle units**: Click temperature unit button to switch °C/°F

### Authentication Features

1. **Sign up/Login**: Create account or sign in
2. **Auto-save searches**: Your searches are automatically saved
3. **View history**: Access your previous weather searches

### Demo Mode

- Click "Continue with Demo" to use without authentication
- All features work except data persistence

## 🔧 Configuration

### API Configuration

Update API keys in `src/context/WeatherContext.jsx` and `src/context/AuthContext.jsx`:

```bash
// Weather API
const API_KEY = 'your_openweather_api_key'
```

```bash
// Supabase
const supabaseUrl = 'your_supabase_url'
const supabaseKey = 'your_supabase_anon_key'
```

### Supabase Setup (Optional)

1. Create a new Supabase project
2. Create a `weather_searches` table:

```bash
   CREATE TABLE weather_searches (
   id SERIAL PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id),
   city TEXT NOT NULL,
   temperature REAL,
   description TEXT,
   searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
```

## 🎨 Customization

### Styling

- Modify `src/index.css` for global styles
- Update TailwindCSS configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Features

- Add new weather parameters in `WeatherDisplay.jsx`
- Extend forecast period in `ForecastDisplay.jsx`
- Add new authentication providers in `AuthContext.jsx`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to vercel

1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure environment variables

## 🧪 Testing

### Run Development Server

```bash
npm run dev
```

### Build and Preview

```bash
npm run build
npm run preview
```

## 📝 API Reference

### OpenWeatherMap Endpoints Used

- Current Weather: `GET /weather?q={city}&appid={API_KEY}&units=metric`
- 5-Day Forecast: `GET /forecast?q={city}&appid={API_KEY}&units=metric`

### Rate Limits

- Free tier: 1,000 calls/day, 60 calls/minute
- Auto-refresh every 30 seconds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**API Key Errors**

- Ensure OpenWeatherMap API key is valid
- Check API key permissions and rate limits

**Supabase Connection Issues**

- Verify Supabase URL and anon key
- Check database table structure
- Ensure RLS policies are configured

**Build Errors**

- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

### Support

For issues and questions, please create an issue in the GitHub repository.
