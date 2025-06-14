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