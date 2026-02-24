import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Home";
import PatientForm from "./PatientForm";
import Login from "./LoginPage";
import Signup from "./RegisterPage"
import MapView from "./MapView";
import DashboardTabs from "./navtabs";

function App() {
  const handleSearch = (data) => {
    console.log("Emergency Data:", data);
    alert(`Searching help for: ${data.location} (${data.severity} - ${data.disease})`);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col items-center bg-slate-50 font-sans">
        <nav className="w-full h-16 bg-slate-900 flex items-center justify-between px-6 md:px-10 shadow-lg mb-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-red-500 opacity-30 animate-ping"></div>
              <div className="relative bg-red-500 text-white rounded-full p-2 shadow-sm">
                <span className="text-xl">📍</span>
              </div>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Finding Nearest Help
            </span>
          </div>

          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </nav>

        <main className="w-full max-w-2xl px-4 pb-12 flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Signup />} />
            <Route path="/form" element={<PatientForm onSubmit={handleSearch} />} />
            <Route path="/hdash" element={<DashboardTabs />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function LanguageSwitcher() {
  useEffect(() => {
    if (document.querySelector('.goog-te-combo')) return;
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te,ta,kn,ml',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('google-translate-script');
      if (el) el.remove();
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div id="google_translate_element" style={{ minWidth: '160px' }} />
  );
}

export default App;
