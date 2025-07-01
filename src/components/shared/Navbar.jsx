import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sun, Moon, User, LayoutDashboard, Briefcase, LogOut, FileText, Bot, Sparkles, MessageSquare, Building2, Home, Info, Search, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Command as CommandPrimitive } from "cmdk";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- Reusable Animated Dropdown Component ---
const AnimatedDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(p => !p)} className="cursor-pointer h-full flex items-center">{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 origin-top bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// --- Command Menu Component ---
const CommandK = ({ open, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    if (typeof document !== 'undefined') {
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }
  }, [setOpen]);
  
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [open]);
  
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="w-[90%] max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CommandPrimitive className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 font-sans">
              <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandPrimitive.Input className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400" placeholder="Type a command or search..." />
              </div>
              <CommandPrimitive.List className="max-h-[min(50vh,300px)] overflow-y-auto overflow-x-hidden p-2">
                <CommandPrimitive.Empty>No results found.</CommandPrimitive.Empty>
                {commandItems.map((group) => (
                  <CommandPrimitive.Group key={group.group} heading={group.group} className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 px-2 py-1.5">
                    {group.items.map((item) => (
                      <CommandPrimitive.Item key={item.name} onSelect={() => runCommand(item.onSelect)} className="flex items-center gap-3 p-2 my-1 rounded-md text-sm font-medium cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
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


// --- THE FINAL, DEFINITIVE NAVBAR ---
const Navbar = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
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
    { label: "Home", to: "/home" },
    { label: "Jobs", to: "/jobs" },
    { label: "Company", to: "/companies" },
    { label: "About", to: "/about" },
  ];

  const aiInsightsLinks = [
    { label: 'Resume Analyzer', icon: <FileText size={16}/>, to: '/ai/analyze-resume' },
    { label: 'Job Recommendations', icon: <Sparkles size={16}/>, to: '/ai/recommend-jobs' },
    { label: 'Cover Letter Generator', icon: <Bot size={16} />, to: '/ai/cover-letter' }, 
    { label: 'AI Chat Assistant', icon: <MessageSquare size={16}/>, to: '/ai/chat' },
  ];

  return (
    <>
      <CommandK open={commandMenuOpen} setOpen={setCommandMenuOpen} />
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-900/10 dark:border-white/10 font-sans">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                JobHunt
              </Link>
              <nav className="hidden lg:flex items-center gap-1 h-full">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className="relative px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors duration-300">
                    {({ isActive }) => (
                      <>
                        <span className="relative z-10">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="active-nav-underline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
                <AnimatedDropdown 
                  trigger={
                    <div className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer">
                      AI Insights
                      <ChevronDown size={16} className="text-slate-400 mt-0.5" />
                    </div>
                  }
                >
                  <div className="p-2">
                    {aiInsightsLinks.map(link => (
                      <Link key={link.label} to={link.to} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                        <span className="text-indigo-500">{link.icon}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </AnimatedDropdown>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCommandMenuOpen(true)} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 border border-slate-900/10 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <Search size={16} />
                <span className="hidden sm:inline">Tools...</span>
                <div className="hidden sm:block ml-auto text-xs border border-slate-200 dark:border-slate-700 rounded-sm px-1.5 py-0.5">⌘K</div>
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
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-200 transform hover:scale-105">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;