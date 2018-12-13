export const goTo = section => ({
  type: 'GO_TO',
  payload: section,
});

export const openMenu = () => ({
  type: 'MENU_OPEN'
});

export const closeMenu = () => ({
  type: 'MENU_CLOSE'
});