export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
};

export const pagePadding = { xs: 2, md: 3 };

export const cardRadius = 12;
export const inputRadius = 8;

export const sidebarWidth = 260;

export const activeNavItem = {
  borderLeft: 3,
  borderColor: 'primary.main',
  bgcolor: 'action.selected',
  '& .MuiListItemIcon-root': { color: 'primary.main' },
};

/** Scrollable flex child — minHeight:0 prevents flex overflow bugs */
export const scrollAreaSx = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,0,0,0.2) transparent',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    my: 1,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 8,
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
};
