import React, {useState} from 'react';

import {
  Divider,
  Menu as PaperMenu,
  MenuProps as PaperMenuProps,
} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';
import {MenuItem, MenuItemProps} from './MenuItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Separator = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return <Divider style={styles.separator} />;
};

const GroupSeparator = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <PaperMenu.Item
      title=""
      style={[
        styles.groupSeparator,
        {backgroundColor: theme.colors.menuGroupSeparator},
      ]}
      disabled
    />
  );
};

export interface MenuProps extends Omit<PaperMenuProps, 'theme'> {
  selectable?: boolean;
}

export const Menu: React.FC<MenuProps> & {
  Item: typeof MenuItem;
  GroupSeparator: typeof GroupSeparator;
  Separator: typeof Separator;
} = ({children, selectable = false, ...menuProps}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [hasActiveSubmenu, setHasActiveSubmenu] = useState(false);
  const statusBarHeight = useSafeAreaInsets().top;

  const handleSubmenuOpen = () => setHasActiveSubmenu(true);
  const handleSubmenuClose = () => setHasActiveSubmenu(false);

  return (
    <PaperMenu
      {...menuProps}
      style={[
        styles.menu,
        hasActiveSubmenu && styles.menuWithSubmenu,
        menuProps.style,
      ]}
      statusBarHeight={statusBarHeight}
      contentStyle={[
        styles.content,
        hasActiveSubmenu && styles.contentWithSubmenu,
      ]}>
      {React.Children.map(children, child => {
        if (React.isValidElement<MenuItemProps>(child)) {
          // Check if this is a React.Fragment - if so, don't try to clone it with our props
          if (typeof child.type === 'symbol' || child.type === React.Fragment) {
            return child;
          }

          // For all other valid React elements, try to clone with our props
          return React.cloneElement(child, {
            onSubmenuOpen: handleSubmenuOpen,
            onSubmenuClose: handleSubmenuClose,
            selectable,
          });
        }
        return child;
      })}
    </PaperMenu>
  );
};

Menu.Item = MenuItem;
Menu.GroupSeparator = GroupSeparator;
Menu.Separator = Separator;
