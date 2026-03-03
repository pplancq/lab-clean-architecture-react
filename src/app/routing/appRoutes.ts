export const appRoutes = {
  home: '/',
  addGame: '/add-game',
  gameDetail: (id: string) => `/games/${id}`,
  editGame: (id: string) => `/games/${id}/edit`,
};
