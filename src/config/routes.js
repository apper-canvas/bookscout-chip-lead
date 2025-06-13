import Home from '@/components/pages/Home';
import Discover from '@/components/pages/Discover';
import BookDetail from '@/components/pages/BookDetail';
import Dashboard from '@/components/pages/Dashboard';
import NotFound from '@/components/pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
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
    component: Dashboard
  },
  bookDetail: {
    id: 'bookDetail',
    label: 'Book Detail',
    path: '/book/:id',
    icon: 'Book',
    component: BookDetail,
    hideFromNav: true
  },
  notFound: {
    id: 'notFound',
    label: '404',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;