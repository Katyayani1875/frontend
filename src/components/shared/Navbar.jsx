import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Menu,
  Sun,
  Moon,
  X,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";

// Reusable Dropdown
const Dropdown = ({ title, links }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
        type="button"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute top-full left-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-xl rounded-xl z-30 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 ${
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMobileDropdownOpen, setAiMobileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  const aiInsightsLinks = [
    { label: t("Resume Analyzer"), to: "/ai/analyze-resume" },
    { label: t("Job Recommendations"), to: "/ai/recommend-jobs" },
    { label: t("Cover Letter Generator"), to: "/ai/cover-letter" },
    { label: t("AI Chat Assistant"), to: "/ai/chat" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 font-inter tracking-wide">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-pink-700 to-indigo-500 bg-clip-text text-transparent"
        >
          JobHunt
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center text-sm font-medium">
            <Link
              to="/home"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
            >
              {t("Home")}
            </Link>
            <Link
              to="/jobs"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
            >
              {t("Jobs")}
            </Link>
             <Link
              to="/Companies"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
            >
              {t("Company")}
            </Link>
            <div className="pr-4">
              <Dropdown title={t("AI Insights")} links={aiInsightsLinks} />
            </div>
            <Link
              to="/about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-6"
            >
              {t("About")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="pr-2">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {notifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="pr-2"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <select
              className="bg-transparent text-sm text-gray-600 dark:text-gray-300 border-none focus:outline-none pr-2"
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="es">ES</option>
            </select>

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <UserCircle className="w-8 h-8 text-gray-500 dark:text-gray-300" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-30 animate-fade-in">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("View Profile")}
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("Dashboard")}
                      </Link>
                      {user.role === "candidate" && (
                        <Link
                          to="/applications"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {t("My Applications")}
                        </Link>
                      )}
                      {user.role === "employer" && (
                        <Link
                          to="/jobs"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {t("My Jobs")}
                        </Link>
                      )}
                      {/* <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">{t('Settings')}</Link> */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("Logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("Login")}
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("Register")}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white dark:bg-gray-900 py-4 px-6 md:hidden">
          <Link
            to="/home"
            className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {t("Home")}
          </Link>
          <Link
            to="/jobs"
            className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {t("Jobs")}
          </Link>
          <div className="my-2">
            <button
              onClick={() => setAiMobileDropdownOpen(!aiMobileDropdownOpen)}
              className="flex items-center justify-between w-full py-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span>{t("AI Insights")}</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform ${
                  aiMobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {aiMobileDropdownOpen && (
              <div className="ml-4">
                {aiInsightsLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block py-2 text-sm hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/about"
            className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {t("About")}
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          {user ? (
            <>
              <Link
                to="/profile"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t("View Profile")}
              </Link>
              <Link
                to="/dashboard"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t("Dashboard")}
              </Link>
              {user.role === "candidate" && (
                <Link
                  to="/applications"
                  className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {t("My Applications")}
                </Link>
              )}
              {user.role === "employer" && (
                <Link
                  to="/jobs"
                  className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {t("My Jobs")}
                </Link>
              )}
              {/* <Link to="/settings" className="block py-2 hover:text-blue-600 dark:hover:text-blue-400">{t('Settings')}</Link> */}
              <button
                onClick={handleLogout}
                className="block py-2 text-red-500 hover:text-red-600 dark:hover:text-red-400"
              >
                {t("Logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t("Login")}
              </Link>
              <Link
                to="/register"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t("Register")}
              </Link>
            </>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <select
            className="bg-transparent text-sm text-gray-600 dark:text-gray-300 border-none focus:outline-none"
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="es">ES</option>
          </select>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 mt-2"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
            <span>{isDark ? t("Light Mode") : t("Dark Mode")}</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
