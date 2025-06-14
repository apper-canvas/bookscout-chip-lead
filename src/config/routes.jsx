import { Navigate } from "react-router-dom";
import Home from "@/components/pages/Home";
import Discover from "@/components/pages/Discover";
import Dashboard from "@/components/pages/Dashboard";
import BookDetail from "@/components/pages/BookDetail";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import NotFound from "@/components/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Search',
    component: Discover
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'User',
    component: () => (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  bookDetail: {
    id: 'bookDetail',
    label: 'Book Detail',
    path: '/book/:id',
    icon: 'Book',
    component: BookDetail,
    hideFromNav: true
  },
  login: {
    id: 'login',
    label: 'Login',
    path: '/login',
    icon: 'LogIn',
    component: Login,
    hideFromNav: true
  },
  signup: {
    id: 'signup',
    label: 'Sign Up',
    path: '/signup',
    icon: 'UserPlus',
    component: Signup,
    hideFromNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    icon: 'AlertCircle',
    component: NotFound,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);

export default routes;