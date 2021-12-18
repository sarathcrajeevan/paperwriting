import React from 'react';
import { VerticalMenuProps } from '../../../VerticalMenu.types';
import VerticalMenuRoot from '../../VerticalMenuRoot';
import styles from './styles/skins.scss';

const VerticalMenuSolidColorSkin: React.FC<VerticalMenuProps> = props => {
  return <VerticalMenuRoot {...props} style={styles} separatedButton={false} />;
};

export default VerticalMenuSolidColorSkin;
