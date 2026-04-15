// Placeholder — will be implemented in Story 9.3 (#133)
type BurgerMenuDrawerProps = {
  id: string;
  isOpen: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClose: () => void;
};

export const BurgerMenuDrawer = ({ id, isOpen }: BurgerMenuDrawerProps) => {
  return <div id={id} hidden={!isOpen} />;
};
