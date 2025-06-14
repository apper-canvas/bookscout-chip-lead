import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { routes } from "@/config/routes.jsx";
import SearchBar from "@/components/molecules/SearchBar";
import { toast } from "react-toastify";
import { logout } from "@/store/authSlice";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navItems = Object.values(routes).filter(route => !route.hideFromNav);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/home');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
    {/* Header */}
    <header
        className="flex-shrink-0 bg-surface border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                    <NavLink to="/home" className="flex items-center space-x-2">
                        <ApperIcon name="BookOpen" className="w-8 h-8 text-primary" />
                        <span className="font-display font-bold text-xl text-primary">BookScout</span>
                    </NavLink>
                </div>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map(item => <NavLink
                        key={item.id}
                        to={item.path}
                        className={(
                            {
                                isActive
                            }
                        ) => `flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-white" : "text-gray-700 hover:text-primary hover:bg-primary/10"}`}>
                        <ApperIcon name={item.icon} size={16} />
                        <span>{item.label}</span>
                    </NavLink>)}
                </nav>
                {/* Search Bar - Desktop */}
                <div className="hidden lg:block flex-1 max-w-lg mx-8">
                    <SearchBar />
                </div>
                {/* User Menu & Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2">
                        {isAuthenticated ? <>
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                className="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                                <ApperIcon name="Bell" size={20} />
                            </motion.button>
                            <div className="relative">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                                    <ApperIcon name="User" size={20} />
                                    <span className="text-sm font-medium">{user?.name || "User"}</span>
                                    <ApperIcon name="ChevronDown" size={16} />
                                </motion.button>
                                <AnimatePresence>
                                    {userMenuOpen && <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10
                                        }}
                                        className="absolute right-0 mt-2 w-48 bg-surface border border-gray-200 rounded-lg shadow-lg z-50">
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    navigate("/dashboard");
                                                    setUserMenuOpen(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-primary/10 transition-colors">
                                                <ApperIcon name="User" size={16} />
                                                <span>Dashboard</span>
                                            </button>
                                            <hr className="my-1 border-gray-200" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors">
                                                <ApperIcon name="LogOut" size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>}
                                </AnimatePresence>
                            </div>
                        </> : <motion.button
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">Sign In
                                              </motion.button>}
                    </div>
                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                        <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
                    </button>
                </div>
            </div>
            {/* Mobile Search Bar */}
            <div className="lg:hidden pb-4">
                <SearchBar />
            </div>
        </div>
    </header>
    {/* Mobile Menu */}
    <AnimatePresence>
        {mobileMenuOpen && <>
            <motion.div
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                exit={{
                    opacity: 0
                }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)} />
            <motion.div
                initial={{
                    x: "100%"
                }}
                animate={{
                    x: 0
                }}
                exit={{
                    x: "100%"
                }}
                transition={{
                    type: "tween",
                    duration: 0.3
                }}
                className="fixed top-0 right-0 h-full w-64 bg-surface shadow-xl z-50 md:hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-display font-bold text-lg text-primary">Menu</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10">
                            <ApperIcon name="X" size={20} />
                        </button>
                    </div>
                    <nav className="space-y-4">
                        {navItems.map(item => <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={(
                                {
                                    isActive
                                }
                            ) => `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? "bg-primary text-white" : "text-gray-700 hover:text-primary hover:bg-primary/10"}`}>
                            <ApperIcon name={item.icon} size={20} />
                            <span>{item.label}</span>
                        </NavLink>)}
                    </nav>
                    <div className="mt-8 pt-8 border-t border-primary/20">
                        <div className="space-y-4">
                            {isAuthenticated ? <>
                                <button
                                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                                    <ApperIcon name="Bell" size={20} />
                                    <span>Notifications</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/dashboard");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors">
                                    <ApperIcon name="User" size={20} />
                                    <span>Dashboard</span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-error hover:bg-error/10 transition-colors">
                                    <ApperIcon name="LogOut" size={20} />
                                    <span>Sign Out</span>
                                </button>
                            </> : <button
                                onClick={() => {
                                    navigate("/login");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                                <ApperIcon name="LogIn" size={20} />
                                <span>Sign In</span>
                            </button>}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>}
    </AnimatePresence>
    {/* Main Content */}
    <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{
                        opacity: 0,
                        x: 20
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                    exit={{
                        opacity: 0,
                        x: -20
                    }}
                    transition={{
                        duration: 0.3
                    }}
                    className="h-full">
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </main>
    </div>
</div>
  );
};

export default Layout;