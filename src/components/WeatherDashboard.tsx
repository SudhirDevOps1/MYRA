import { useState, useCallback, useEffect } from 'react';

interface WeatherDashboardProps {
  open: boolean;
  accentColor: string;
  onClose: () => void;
  onSpeakWeather: (text: string) => void;
  lang: 'en' | 'hi';
}

interface GeoResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  display: string;
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    code: number;
    rain: number;
  }>;
  hourly: Array<{
    hour: string;
    temp: number;
    code: number;
  }>;
  location: GeoResult;
  fetchedAt: number;
}

const STORAGE_RECENT = 'myra_weather_recent';
const STORAGE_FAV = 'myra_weather_favorites';

// WMO Weather Code → emoji + description
const WEATHER_CODES: Record<number, { emoji: string; en: string; hi: string }> = {
  0:  { emoji: '☀️', en: 'Clear sky',          hi: 'Saaf aasman' },
  1:  { emoji: '🌤️', en: 'Mainly clear',       hi: 'Zyaadatar saaf' },
  2:  { emoji: '⛅', en: 'Partly cloudy',       hi: 'Thode baadal' },
  3:  { emoji: '☁️', en: 'Overcast',            hi: 'Ghane baadal' },
  45: { emoji: '🌫️', en: 'Foggy',              hi: 'Kohra' },
  48: { emoji: '🌫️', en: 'Rime fog',           hi: 'Jamta hua kohra' },
  51: { emoji: '🌦️', en: 'Light drizzle',      hi: 'Halki bauchhar' },
  53: { emoji: '🌦️', en: 'Drizzle',            hi: 'Bauchhar' },
  55: { emoji: '🌧️', en: 'Heavy drizzle',      hi: 'Tez bauchhar' },
  61: { emoji: '🌧️', en: 'Light rain',         hi: 'Halki baarish' },
  63: { emoji: '🌧️', en: 'Rain',               hi: 'Baarish' },
  65: { emoji: '🌧️', en: 'Heavy rain',         hi: 'Tez baarish' },
  71: { emoji: '🌨️', en: 'Light snow',         hi: 'Halki barfbari' },
  73: { emoji: '🌨️', en: 'Snow',               hi: 'Barfbari' },
  75: { emoji: '❄️', en: 'Heavy snow',         hi: 'Tez barfbari' },
  77: { emoji: '🌨️', en: 'Snow grains',        hi: 'Barf ke daane' },
  80: { emoji: '🌧️', en: 'Rain showers',       hi: 'Bauchhar' },
  81: { emoji: '🌧️', en: 'Heavy showers',      hi: 'Tez bauchhar' },
  82: { emoji: '⛈️', en: 'Violent showers',    hi: 'Bahut tez bauchhar' },
  85: { emoji: '🌨️', en: 'Snow showers',       hi: 'Barf ki bauchhar' },
  86: { emoji: '❄️', en: 'Heavy snow showers', hi: 'Tez barf ki bauchhar' },
  95: { emoji: '⛈️', en: 'Thunderstorm',       hi: 'Tufaan ke saath baarish' },
  96: { emoji: '⛈️', en: 'Thunder + hail',     hi: 'Tufaan aur ole' },
  99: { emoji: '⛈️', en: 'Heavy thunder',      hi: 'Bahut tez tufaan' },
};

function describeWeather(code: number, lang: 'en' | 'hi'): { emoji: string; text: string } {
  const w = WEATHER_CODES[code] || { emoji: '🌡️', en: 'Unknown', hi: 'Pata nahi' };
  return { emoji: w.emoji, text: lang === 'hi' ? w.hi : w.en };
}

function getWindDirection(deg: number, lang: 'en' | 'hi'): string {
  const dirs = lang === 'hi'
    ? ['Uttar', 'NE', 'Poorab', 'SE', 'Dakshin', 'SW', 'Pashchim', 'NW']
    : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function timeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso: string, lang: 'en' | 'hi'): string {
  const d = new Date(iso);
  const days = lang === 'hi'
    ? ['Sun', 'Som', 'Mang', 'Bud', 'Guru', 'Shu', 'Shani']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

export default function WeatherDashboard({ open, accentColor, onClose, onSpeakWeather, lang }: WeatherDashboardProps) {
  const [query, setQuery] = useState('');
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<GeoResult[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_RECENT) || '[]'); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<GeoResult[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_FAV) || '[]'); } catch { return []; }
  });

  // Persist recent + favorites
  useEffect(() => {
    try { localStorage.setItem(STORAGE_RECENT, JSON.stringify(recent.slice(0, 6))); } catch { /* ignore */ }
  }, [recent]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_FAV, JSON.stringify(favorites)); } catch { /* ignore */ }
  }, [favorites]);

  // Geocode using FREE Open-Meteo Geocoding API (no key required)
  const searchLocations = useCallback(async (q: string) => {
    const cleaned = q.trim();
    if (cleaned.length < 2) { setGeoResults([]); return; }
    setSearching(true);
    setError('');
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleaned)}&count=8&language=${lang === 'hi' ? 'hi' : 'en'}&format=json`
      );
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        const results: GeoResult[] = data.results.map((r: any) => ({
          name: r.name,
          country: r.country || '',
          state: r.admin1 || r.admin2 || '',
          lat: r.latitude,
          lon: r.longitude,
          display: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
        }));
        setGeoResults(results);
      } else {
        setGeoResults([]);
      }
    } catch (e: any) {
      // Fallback to OpenStreetMap Nominatim (free, no key)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned)}&format=json&limit=8&accept-language=${lang === 'hi' ? 'hi' : 'en'}`,
          { headers: { 'User-Agent': 'MYRA-Voice-Assistant/2.0' } }
        );
        const data = await res.json();
        const results: GeoResult[] = data.map((r: any) => ({
          name: r.display_name.split(',')[0],
          country: r.display_name.split(',').pop()?.trim() || '',
          state: '',
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          display: r.display_name,
        }));
        setGeoResults(results);
      } catch {
        setError(lang === 'hi' ? 'Location search fail ho gaya. Internet check karein.' : 'Location search failed. Check internet.');
      }
    } finally {
      setSearching(false);
    }
  }, [lang]);

  // Auto-search as you type (debounced)
  useEffect(() => {
    if (!query.trim()) { setGeoResults([]); return; }
    const timer = setTimeout(() => searchLocations(query), 350);
    return () => clearTimeout(timer);
  }, [query, searchLocations]);

  // Fetch weather using FREE Open-Meteo API (no key required)
  const fetchWeather = useCallback(async (loc: GeoResult) => {
    setLoading(true);
    setError('');
    setGeoResults([]);
    setQuery(loc.display);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index,visibility` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum` +
        `&timezone=auto&forecast_days=7`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.current) {
        throw new Error(data.reason || 'Weather data unavailable');
      }

      const c = data.current;
      const d = data.daily;
      const h = data.hourly;

      // Get next 8 hours
      const now = new Date();
      const hourly: WeatherData['hourly'] = [];
      for (let i = 0; i < h.time.length && hourly.length < 8; i++) {
        const t = new Date(h.time[i]);
        if (t >= now) {
          hourly.push({
            hour: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(h.temperature_2m[i]),
            code: h.weather_code[i],
          });
        }
      }

      const daily: WeatherData['daily'] = d.time.map((t: string, i: number) => ({
        date: t,
        tempMax: Math.round(d.temperature_2m_max[i]),
        tempMin: Math.round(d.temperature_2m_min[i]),
        code: d.weather_code[i],
        rain: d.precipitation_sum[i] || 0,
      }));

      const info: WeatherData = {
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        windSpeed: Math.round(c.wind_speed_10m),
        windDirection: c.wind_direction_10m,
        pressure: Math.round(c.pressure_msl),
        cloudCover: c.cloud_cover,
        precipitation: c.precipitation,
        weatherCode: c.weather_code,
        isDay: c.is_day === 1,
        uvIndex: c.uv_index,
        visibility: Math.round((c.visibility || 0) / 1000), // km
        sunrise: d.sunrise[0],
        sunset: d.sunset[0],
        daily,
        hourly,
        location: loc,
        fetchedAt: Date.now(),
      };

      setWeather(info);

      // Add to recent (avoid duplicates)
      setRecent(prev => {
        const filtered = prev.filter(r => r.display !== loc.display);
        return [loc, ...filtered].slice(0, 6);
      });

      // Auto-speak the report
      const desc = describeWeather(c.weather_code, lang);
      const spoken = lang === 'hi'
        ? `${loc.name} mein abhi taapman ${info.temp} degree Celsius hai. Mausam ${desc.text} hai. Hawa ${info.windSpeed} kilometer prati ghanta. Aaj zyaadatar ${Math.round(d.temperature_2m_max[0])} aur kam se kam ${Math.round(d.temperature_2m_min[0])} degree rahega.`
        : `Current temperature in ${loc.name} is ${info.temp} degrees Celsius. Weather is ${desc.text}. Wind speed ${info.windSpeed} kilometers per hour. Today's high will be ${Math.round(d.temperature_2m_max[0])} and low ${Math.round(d.temperature_2m_min[0])} degrees.`;
      onSpeakWeather(spoken);
    } catch (e: any) {
      setError(e.message || (lang === 'hi' ? 'Weather data fetch nahi ho saka' : 'Failed to fetch weather'));
    } finally {
      setLoading(false);
    }
  }, [lang, onSpeakWeather]);

  // Detect current location
  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(lang === 'hi' ? 'Geolocation support nahi hai.' : 'Geolocation not supported.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Reverse geocode using Open-Meteo
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&language=${lang === 'hi' ? 'hi' : 'en'}`
          );
          const data = await res.json();
          const r = data.results?.[0];
          const loc: GeoResult = {
            name: r?.name || 'Your Location',
            country: r?.country || '',
            state: r?.admin1 || '',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            display: r ? [r.name, r.admin1, r.country].filter(Boolean).join(', ') : 'Current Location',
          };
          fetchWeather(loc);
        } catch {
          // Fallback: just use coords
          const loc: GeoResult = {
            name: 'Current Location',
            country: '',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            display: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`,
          };
          fetchWeather(loc);
        }
      },
      (err) => {
        setError(lang === 'hi' ? 'Location permission denied.' : `Location error: ${err.message}`);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, [lang, fetchWeather]);

  const toggleFavorite = useCallback((loc: GeoResult) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.display === loc.display);
      if (exists) return prev.filter(f => f.display !== loc.display);
      return [loc, ...prev].slice(0, 10);
    });
  }, []);

  const isFavorite = weather && favorites.find(f => f.display === weather.location.display);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex justify-center items-start overflow-y-auto pt-6 pb-12 px-3 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-4 sm:p-5 space-y-4 my-2">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg sm:text-xl tracking-wider flex items-center gap-2">
              <span>🌍</span> WEATHER
            </h2>
            <p className="text-[#666] text-[10px] font-mono mt-0.5">
              {lang === 'hi' ? 'Free API · Bina key · Worldwide' : 'Free API · No key · Worldwide'}
            </p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white p-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'City, gaon, state... (e.g. Patna, Lucknow, Pune)' : 'City, village, place... (e.g. Mumbai, Tokyo, Paris)'}
                className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2.5 text-[#EEE] text-sm focus:outline-none transition-colors"
                style={{ borderColor: query ? accentColor : undefined }}
                autoFocus
              />
              {searching && (
                <span className="absolute right-3 top-2.5 text-[10px] text-[#888] animate-pulse">⏳</span>
              )}
            </div>
            <button
              onClick={useMyLocation}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 disabled:opacity-40"
              style={{ borderColor: accentColor, color: accentColor }}
              title={lang === 'hi' ? 'Meri location use karo' : 'Use my location'}
            >
              📍
            </button>
          </div>

          {/* Geo results dropdown */}
          {geoResults.length > 0 && (
            <div className="mt-2 bg-[#0E0E0E] border border-[#222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {geoResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => fetchWeather(r)}
                  className="w-full text-left px-3 py-2 hover:bg-[#1A1A1A] transition-colors border-b border-[#1A1A1A] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: accentColor }}>📍</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-semibold truncate">{r.name}</p>
                      <p className="text-[10px] text-[#666] truncate">
                        {[r.state, r.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick shortcuts: favorites + recent + popular */}
        {!weather && !loading && geoResults.length === 0 && (
          <div className="space-y-3">
            {favorites.length > 0 && (
              <div>
                <p className="text-[10px] text-[#666] font-mono uppercase mb-1.5">⭐ Favorites</p>
                <div className="flex flex-wrap gap-1.5">
                  {favorites.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => fetchWeather(f)}
                      className="text-[10px] bg-[#1A1A00] text-[#FFE066] hover:bg-[#2A2A00] px-2.5 py-1 rounded-full border border-[#FFE066]/30 transition-colors"
                    >
                      ⭐ {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recent.length > 0 && (
              <div>
                <p className="text-[10px] text-[#666] font-mono uppercase mb-1.5">🕐 Recent</p>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => fetchWeather(r)}
                      className="text-[10px] bg-[#111] text-[#999] hover:text-white px-2.5 py-1 rounded-full border border-[#222] transition-colors"
                    >
                      🕐 {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] text-[#666] font-mono uppercase mb-1.5">🌐 Popular Cities</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {[
                  { name: 'Delhi',     lat: 28.6139, lon: 77.2090, country: 'India' },
                  { name: 'Mumbai',    lat: 19.0760, lon: 72.8777, country: 'India' },
                  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, country: 'India' },
                  { name: 'Kolkata',   lat: 22.5726, lon: 88.3639, country: 'India' },
                  { name: 'Chennai',   lat: 13.0827, lon: 80.2707, country: 'India' },
                  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, country: 'India' },
                  { name: 'Pune',      lat: 18.5204, lon: 73.8567, country: 'India' },
                  { name: 'London',    lat: 51.5074, lon: -0.1278, country: 'UK'    },
                  { name: 'New York',  lat: 40.7128, lon: -74.0060, country: 'USA'  },
                  { name: 'Tokyo',     lat: 35.6762, lon: 139.6503, country: 'Japan' },
                  { name: 'Dubai',     lat: 25.2048, lon: 55.2708, country: 'UAE'   },
                  { name: 'Sydney',    lat: -33.8688, lon: 151.2093, country: 'AUS' },
                ].map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => fetchWeather({ ...loc, display: `${loc.name}, ${loc.country}` })}
                    className="text-[10px] bg-[#0E0E0E] text-[#CCC] hover:text-white px-2 py-1.5 rounded-lg border border-[#222] hover:border-[#444] transition-all"
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#111] rounded-xl p-6 text-center">
            <div className="text-3xl animate-pulse">🌐</div>
            <p className="text-xs text-[#888] mt-2 font-mono">
              {lang === 'hi' ? 'Mausam fetch ho raha hai...' : 'Fetching weather...'}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#1A0000] border border-[#FF1744] rounded-xl p-3 text-xs text-[#FF6D6D] flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-3">
            {/* Main card */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: weather.isDay
                  ? `linear-gradient(135deg, ${accentColor}11, #00B8D411, #0A0A0A)`
                  : `linear-gradient(135deg, #1A0033, #0A0A0A, #000)`,
                borderColor: `${accentColor}33`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: accentColor }}>📍</span>
                    <p className="text-xs text-white font-bold truncate">{weather.location.name}</p>
                    <button
                      onClick={() => toggleFavorite(weather.location)}
                      className="text-[12px] hover:scale-110 transition-transform"
                      title={isFavorite ? 'Remove favorite' : 'Add favorite'}
                    >
                      {isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#888] truncate mt-0.5">
                    {[weather.location.state, weather.location.country].filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-[#666] font-mono">
                    {weather.isDay ? '☀️ Day' : '🌙 Night'}
                  </p>
                  <p className="text-[9px] text-[#555] font-mono">
                    {new Date(weather.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-5xl sm:text-6xl">
                  {describeWeather(weather.weatherCode, lang).emoji}
                </div>
                <div className="flex-1">
                  <p className="text-4xl sm:text-5xl font-black" style={{ color: accentColor }}>
                    {weather.temp}°
                  </p>
                  <p className="text-xs text-[#CCC] mt-0.5">
                    {describeWeather(weather.weatherCode, lang).text}
                  </p>
                  <p className="text-[10px] text-[#888] font-mono mt-0.5">
                    {lang === 'hi' ? 'Mehsoos' : 'Feels like'} {weather.feelsLike}°
                  </p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {[
                { label: lang === 'hi' ? 'Humidity' : 'Humidity', value: `${weather.humidity}%`, icon: '💧' },
                { label: lang === 'hi' ? 'Hawa' : 'Wind',         value: `${weather.windSpeed} km/h`, icon: '💨' },
                { label: lang === 'hi' ? 'Disha' : 'Direction',   value: getWindDirection(weather.windDirection, lang), icon: '🧭' },
                { label: lang === 'hi' ? 'Daab' : 'Pressure',     value: `${weather.pressure} hPa`, icon: '📊' },
                { label: lang === 'hi' ? 'Baadal' : 'Clouds',     value: `${weather.cloudCover}%`, icon: '☁️' },
                { label: 'UV',                                    value: `${weather.uvIndex || 0}`, icon: '🌞' },
                { label: lang === 'hi' ? 'Drishti' : 'Visibility', value: `${weather.visibility} km`, icon: '👁️' },
                { label: lang === 'hi' ? 'Baarish' : 'Rain',      value: `${weather.precipitation} mm`, icon: '🌧️' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0E0E0E] rounded-lg p-2 border border-[#1A1A1A] text-center">
                  <div className="text-base">{stat.icon}</div>
                  <p className="text-[9px] text-[#666] font-mono mt-0.5">{stat.label}</p>
                  <p className="text-[11px] text-white font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Sun times */}
            <div className="bg-[#0E0E0E] rounded-xl p-3 border border-[#1A1A1A] flex items-center justify-around text-xs">
              <div className="text-center">
                <p className="text-[9px] text-[#666] font-mono">🌅 SUNRISE</p>
                <p className="text-white font-bold mt-0.5">{timeOnly(weather.sunrise)}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-[#666] font-mono">🌇 SUNSET</p>
                <p className="text-white font-bold mt-0.5">{timeOnly(weather.sunset)}</p>
              </div>
            </div>

            {/* Hourly forecast */}
            {weather.hourly.length > 0 && (
              <div>
                <p className="text-[10px] text-[#666] font-mono uppercase mb-1.5">
                  {lang === 'hi' ? 'Aane wale ghante' : 'Next 8 Hours'}
                </p>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
                  {weather.hourly.map((h, i) => (
                    <div key={i} className="flex-shrink-0 bg-[#0E0E0E] rounded-lg p-2 border border-[#1A1A1A] text-center min-w-[55px]">
                      <p className="text-[9px] text-[#666] font-mono">{h.hour}</p>
                      <div className="text-lg">{describeWeather(h.code, lang).emoji}</div>
                      <p className="text-[11px] text-white font-bold">{h.temp}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-day forecast */}
            <div>
              <p className="text-[10px] text-[#666] font-mono uppercase mb-1.5">
                {lang === 'hi' ? '7 din ka mausam' : '7-Day Forecast'}
              </p>
              <div className="space-y-1">
                {weather.daily.map((d, i) => (
                  <div key={i} className="bg-[#0E0E0E] rounded-lg p-2 border border-[#1A1A1A] flex items-center gap-3">
                    <span className="text-[11px] text-[#999] font-mono w-10">
                      {i === 0 ? (lang === 'hi' ? 'Aaj' : 'Today') : dayLabel(d.date, lang)}
                    </span>
                    <span className="text-base">{describeWeather(d.code, lang).emoji}</span>
                    <span className="text-[10px] text-[#999] flex-1 truncate">
                      {describeWeather(d.code, lang).text}
                    </span>
                    {d.rain > 0 && (
                      <span className="text-[9px] text-[#40C4FF]">💧 {d.rain.toFixed(1)}mm</span>
                    )}
                    <span className="text-xs text-[#666]">{d.tempMin}°</span>
                    <span className="text-xs text-white font-bold w-8 text-right">{d.tempMax}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const desc = describeWeather(weather.weatherCode, lang);
                  const txt = lang === 'hi'
                    ? `${weather.location.name} mein abhi taapman ${weather.temp} degree hai. Mausam ${desc.text} hai. Hawa ${weather.windSpeed} kilometer prati ghanta ${getWindDirection(weather.windDirection, lang)} se. Humidity ${weather.humidity} percent. Aaj zyaadatar ${weather.daily[0].tempMax} aur kam se kam ${weather.daily[0].tempMin} degree.`
                    : `Current temperature in ${weather.location.name} is ${weather.temp} degrees. Weather is ${desc.text}. Wind ${weather.windSpeed} km/h from ${getWindDirection(weather.windDirection, lang)}. Humidity ${weather.humidity} percent. Today's high ${weather.daily[0].tempMax}, low ${weather.daily[0].tempMin} degrees.`;
                  onSpeakWeather(txt);
                }}
                className="flex-1 py-2 text-[11px] font-bold rounded-lg text-black active:scale-95 transition-all"
                style={{ backgroundColor: accentColor }}
              >
                🔊 {lang === 'hi' ? 'Bolke Sunao' : 'Speak Report'}
              </button>
              <button
                onClick={() => fetchWeather(weather.location)}
                className="px-3 py-2 text-[11px] font-bold rounded-lg border text-[#999] hover:text-white active:scale-95 transition-all"
                style={{ borderColor: accentColor }}
                title={lang === 'hi' ? 'Refresh' : 'Refresh'}
              >
                🔄
              </button>
              <button
                onClick={() => { setWeather(null); setQuery(''); }}
                className="px-3 py-2 text-[11px] font-bold rounded-lg border border-[#333] text-[#888] hover:text-white active:scale-95 transition-all"
                title={lang === 'hi' ? 'Naya search' : 'New search'}
              >
                🔍
              </button>
            </div>

            <p className="text-center text-[9px] text-[#444] font-mono">
              Data: Open-Meteo · Free · No key required
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
