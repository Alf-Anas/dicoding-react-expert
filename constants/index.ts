export const SESSION_STORAGE = {
  TOKEN: 'token',
  PROFILE: 'profile',
};

export const ROUTE = {
  HOME: '/',
  LEADERBOARDS: '/leaderboards',
  PROFILE: '/profile',
  NEW: '/new',
  LOGIN: '/login',
  REGISTER: '/register',
  threadsByID: (id: string) => `/threads/${id}`,
};
