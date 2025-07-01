import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sun, Moon, X, User, LayoutDashboard, Briefcase, LogOut, FileText, Bot, Sparkles, MessageSquare, Building2, Home, Info, Menu, Search, Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Command as CommandPrimitive } from "cmdk";

// --- Command Menu Component (The "WOW" Factor) ---
const CommandK = ({ open, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);
  
  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const commandItems = [
    { group: 'Navigation', items: [
      { name: 'Home', icon: <Home size={16}/>, onSelect: () => navigate('/home') },
      { name: 'Jobs', icon: <Briefcase size={16}/>, onSelect: () => navigate('/jobs') },
      { name: 'Companies', icon: <Building2 size={16}/>, onSelect: () => navigate('/companies') },
      { name: 'About', icon: <Info size={16}/>, onSelect: () => navigate('/about') },
    ]},
    { group: 'AI Tools', items: [
      { name: 'Resume Analyzer', icon: <FileText size={16}/>, onSelect: () => navigate('/ai/analyze-resume') },
      { name: 'Job Recommendations', icon: <Sparkles size={16}/>, onSelect: () => navigate('/ai/recommend-jobs') },
      { name: 'Cover Letter Generator', icon: <Bot size={16} />, onSelect: () => navigate('/ai/cover-letter') }, 
      { name: 'AI Chat Assistant', icon: <MessageSquare size={16}/>, onSelect: () => navigate('/ai/chat') },
    ]},
     { group: 'Account', items: [
      { name: 'Dashboard', icon: <LayoutDashboard size={16}/>, onSelect: () => navigate('/dashboard') },
    ]},
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-xl p-4" onClick={(e) => e.stopPropagation()}>
            <CommandPrimitive className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandPrimitive.Input className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400" placeholder="Type a command or search..." />
              </div>
              <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <CommandPrimitive.Empty>No results found.</CommandPrimitive.Empty>
                {commandItems.map((group) => (
                  <CommandPrimitive.Group key={group.group} heading={group.group} className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1.5">
                    {group.items.map((item) => (
                      <CommandPrimitive.Item key={item.name} onSelect={() => runCommand(item.onSelect)} className="flex items-center gap-3 p-2 my-1 rounded-md text-sm cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                        <div className="text-slate-500 dark:text-slate-400">{item.icon}</div>
                        {item.name}
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                ))}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- THE ULTIMATE RESPONSIVE NAVBAR with CommandK ---
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  useEffect(() => {
    const initialDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(p => !p);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  const navLinks = [
    { label: "Home", to: "/home", icon: <Home size={20} /> },
    { label: "Jobs", to: "/jobs", icon: <Briefcase size={20} /> },
    { label: "Company", to: "/companies", icon: <Building2 size={20} /> },
    { label: "AI Insights", to: "/ai/recommend-jobs", icon: <Sparkles size={20} /> },
    { label: "About", to: "/about", icon: <Info size={20} /> },
  ];

  return (
    <>
      <CommandK open={commandMenuOpen} setOpen={setCommandMenuOpen} />
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-900/10 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-4 lg:gap-8">
              <Link to="/" className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                JobHunt
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={({isActive}) => `px-2 py-1.5 rounded-md transition-colors duration-300 flex items-center gap-2 ${isActive ? 'bg-black/5 text-slate-900 dark:bg-white/10 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}>
                       <span className="lg:hidden">{link.icon}</span>
                       <span className="hidden lg:block text-sm font-medium">{link.label}</span>
                    </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCommandMenuOpen(true)} className="hidden lg:flex items-center gap-2 text-sm w-40 px-3 py-1.5 rounded-md text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 border border-slate-900/10 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <Search size={14} />
                Tools...
                <div className="ml-auto text-xs border border-slate-200 dark:border-slate-700 rounded-sm px-1.5 py-0.5">⌘K</div>
              </button>
              
              <button onClick={() => setCommandMenuOpen(true)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors">
                <Search size={18} className="text-slate-600 dark:text-slate-300" />
              </button>

              <button onClick={toggleDarkMode} className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors">
                <AnimatePresence mode="wait">
                  <motion.div key={isDark ? "moon" : "sun"} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }}>
                    {isDark ? <Moon size={18} className="text-slate-300" /> : <Sun size={18} className="text-slate-600" />}
                  </motion.div>
                </AnimatePresence>
              </button>
              {user ? (
                <Link to="/dashboard" className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
                  {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:block px-4 py-1.5 text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                  Sign In
                </Link>
              )}
    
              
              <button className="md:hidden flex items-center justify-center w-9 h-9" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <motion.nav initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-8"><button onClick={() => setMobileMenuOpen(false)} className="p-1"><X size={24}/></button></div>
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <NavLink key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-4 px-4 py-3 text-lg font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    {link.icon} {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { useNotification } from "@/context/NotificationContext";
// import { useTranslation } from "react-i18next";
// import {
//   Bell,
//   Menu,
//   Sun,
//   Moon,
//   X,
//   UserCircle,
//   ChevronDown,
// } from "lucide-react";
// import clsx from "clsx";

// // Reusable Dropdown
// const Dropdown = ({ title, links }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className="relative"
//       ref={ref}
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       <button
//         className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
//         type="button"
//       >
//         {title}
//         <ChevronDown
//           className={`w-4 h-4 transform transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </button>
//       <div
//         className={`absolute top-full left-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-xl rounded-xl z-30 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 ${
//           open
//             ? "opacity-100 visible translate-y-0"
//             : "opacity-0 invisible -translate-y-1"
//         }`}
//       >
//         {links.map((link) => (
//           <Link
//             key={link.label}
//             to={link.to}
//             className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
//           >
//             {link.label}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { notifications } = useNotification();
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();

//   const [isDark, setIsDark] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [aiMobileDropdownOpen, setAiMobileDropdownOpen] = useState(false);
//   const profileDropdownRef = useRef(null);

//   useEffect(() => {
//     const dark = localStorage.getItem("theme") === "dark";
//     setIsDark(dark);
//     document.documentElement.classList.toggle("dark", dark);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(e.target)
//       ) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDarkMode = () => {
//     const newDark = !isDark;
//     setIsDark(newDark);
//     localStorage.setItem("theme", newDark ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newDark);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const changeLanguage = (lang) => i18n.changeLanguage(lang);

//   const aiInsightsLinks = [
//     { label: t("Resume Analyzer"), to: "/ai/analyze-resume" },
//     { label: t("Job Recommendations"), to: "/ai/recommend-jobs" },
//     { label: t("Cover Letter Generator"), to: "/ai/cover-letter" },
//     { label: t("AI Chat Assistant"), to: "/ai/chat" },
//   ];

//   return (
//     <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 font-inter tracking-wide">
//       <div className="container mx-auto px-6 py-3 flex items-center justify-between">
//         <Link
//           to="/"
//           className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-pink-700 to-indigo-500 bg-clip-text text-transparent"
//         >
//           JobHunt
//         </Link>

//         <div className="flex items-center gap-4 md:gap-6">
//           <nav className="hidden md:flex items-center text-sm font-medium">
//             <Link
//               to="/home"
//               className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
//             >
//               {t("Home")}
//             </Link>
//             <Link
//               to="/jobs"
//               className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
//             >
//               {t("Jobs")}
//             </Link>
//              <Link
//               to="/Companies"
//               className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-4"
//             >
//               {t("Company")}
//             </Link>
//             <div className="pr-4">
//               <Dropdown title={t("AI Insights")} links={aiInsightsLinks} />
//             </div>
//             <Link
//               to="/about"
//               className="hover:text-blue-600 dark:hover:text-blue-400 transition pr-6"
//             >
//               {t("About")}
//             </Link>
//           </nav>

//           <div className="flex items-center gap-3">
//             <button aria-label="Notifications" className="pr-2">
//               <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//               {notifications?.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>

//             <button
//               onClick={toggleDarkMode}
//               aria-label="Toggle Theme"
//               className="pr-2"
//             >
//               {isDark ? (
//                 <Sun className="w-5 h-5 text-yellow-400" />
//               ) : (
//                 <Moon className="w-5 h-5 text-gray-700" />
//               )}
//             </button>

//             <select
//               className="bg-transparent text-sm text-gray-600 dark:text-gray-300 border-none focus:outline-none pr-2"
//               onChange={(e) => changeLanguage(e.target.value)}
//               value={i18n.language}
//             >
//               <option value="en">EN</option>
//               <option value="hi">हिंदी</option>
//               <option value="kn">ಕನ್ನಡ</option>
//               <option value="es">ES</option>
//             </select>

//             <div className="relative" ref={profileDropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="focus:outline-none"
//               >
//                 <UserCircle className="w-8 h-8 text-gray-500 dark:text-gray-300" />
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-30 animate-fade-in">
//                   {user ? (
//                     <>
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {t("View Profile")}
//                       </Link>
//                       <Link
//                         to="/dashboard"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {t("Dashboard")}
//                       </Link>
//                       {user.role === "candidate" && (
//                         <Link
//                           to="/applications"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                         >
//                           {t("My Applications")}
//                         </Link>
//                       )}
//                       {user.role === "employer" && (
//                         <Link
//                           to="/jobs"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                         >
//                           {t("My Jobs")}
//                         </Link>
//                       )}
//                       {/* <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">{t('Settings')}</Link> */}
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {t("Logout")}
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         to="/login"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {t("Login")}
//                       </Link>
//                       <Link
//                         to="/register"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {t("Register")}
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="md:hidden focus:outline-none"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             aria-label="Toggle mobile menu"
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6 text-gray-700 dark:text-white" />
//             ) : (
//               <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="bg-white dark:bg-gray-900 py-4 px-6 md:hidden">
//           <Link
//             to="/home"
//             className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//           >
//             {t("Home")}
//           </Link>
//           <Link
//             to="/jobs"
//             className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//           >
//             {t("Jobs")}
//           </Link>
//           <div className="my-2">
//             <button
//               onClick={() => setAiMobileDropdownOpen(!aiMobileDropdownOpen)}
//               className="flex items-center justify-between w-full py-2 hover:text-blue-600 dark:hover:text-blue-400"
//             >
//               <span>{t("AI Insights")}</span>
//               <ChevronDown
//                 className={`w-4 h-4 transform transition-transform ${
//                   aiMobileDropdownOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             {aiMobileDropdownOpen && (
//               <div className="ml-4">
//                 {aiInsightsLinks.map((link) => (
//                   <Link
//                     key={link.label}
//                     to={link.to}
//                     className="block py-2 text-sm hover:text-blue-600 dark:hover:text-blue-400"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//           <Link
//             to="/about"
//             className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//           >
//             {t("About")}
//           </Link>

//           <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
//           {user ? (
//             <>
//               <Link
//                 to="/profile"
//                 className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//               >
//                 {t("View Profile")}
//               </Link>
//               <Link
//                 to="/dashboard"
//                 className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//               >
//                 {t("Dashboard")}
//               </Link>
//               {user.role === "candidate" && (
//                 <Link
//                   to="/applications"
//                   className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//                 >
//                   {t("My Applications")}
//                 </Link>
//               )}
//               {user.role === "employer" && (
//                 <Link
//                   to="/jobs"
//                   className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//                 >
//                   {t("My Jobs")}
//                 </Link>
//               )}
//               {/* <Link to="/settings" className="block py-2 hover:text-blue-600 dark:hover:text-blue-400">{t('Settings')}</Link> */}
//               <button
//                 onClick={handleLogout}
//                 className="block py-2 text-red-500 hover:text-red-600 dark:hover:text-red-400"
//               >
//                 {t("Logout")}
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//               >
//                 {t("Login")}
//               </Link>
//               <Link
//                 to="/register"
//                 className="block py-2 hover:text-blue-600 dark:hover:text-blue-400"
//               >
//                 {t("Register")}
//               </Link>
//             </>
//           )}
//           <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
//           <select
//             className="bg-transparent text-sm text-gray-600 dark:text-gray-300 border-none focus:outline-none"
//             onChange={(e) => changeLanguage(e.target.value)}
//             value={i18n.language}
//           >
//             <option value="en">EN</option>
//             <option value="hi">हिंदी</option>
//             <option value="kn">ಕನ್ನಡ</option>
//             <option value="es">ES</option>
//           </select>
//           <button
//             onClick={toggleDarkMode}
//             className="flex items-center gap-2 mt-2"
//           >
//             {isDark ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-gray-700" />
//             )}
//             <span>{isDark ? t("Light Mode") : t("Dark Mode")}</span>
//           </button>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;
