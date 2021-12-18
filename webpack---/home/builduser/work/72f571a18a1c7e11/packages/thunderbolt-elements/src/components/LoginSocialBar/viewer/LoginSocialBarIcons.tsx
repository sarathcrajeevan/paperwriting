import * as React from 'react';
import classNames from 'classnames';

import {
  DIRECTION_LEFT_TO_RIGHT,
  DIRECTION_RIGHT_TO_LEFT,
  TEST_ID_ICONS,
  TEST_ID_BADGE,
} from '../constants';
import VectorImage from '../../VectorImage/viewer/VectorImage';
import { ILoginSocialBarProps } from '../LoginSocialBar.types';
import styles from './style/LoginSocialBarIcons.scss';

type ILoginSocialBarIconsProps = Pick<
  ILoginSocialBarProps,
  'iconItems' | 'direction'
> & {
  containerId: ILoginSocialBarProps['id'];
};

const getIconAriaLabel = (label: string, displayCount?: number) => {
  if (!label) {
    return;
  }
  return typeof displayCount === 'number' ? `${displayCount} ${label}` : label;
};

const getIconBadgeLabel = (count: number) =>
  count >= 1000 ? `${Math.floor(count / 1000)}k` : count;

const LoginSocialBarIcons: React.FC<ILoginSocialBarIconsProps> = ({
  containerId,
  iconItems,
  direction,
}) => {
  // TODO - should this be moved into css var?
  const className = classNames(styles.root, {
    [styles.rtl]: direction === DIRECTION_RIGHT_TO_LEFT,
    [styles.ltr]: direction === DIRECTION_LEFT_TO_RIGHT,
  });

  return (
    <nav className={className} data-testid={TEST_ID_ICONS}>
      {iconItems.map(({ iconSvgContent, link, label, displayCount }, index) => (
        /**
         * TODO - reuse LogicSocialButton
         */
        <div key={index} className={styles.icon}>
          <VectorImage
            id={`${containerId}-icon`}
            svgContent={iconSvgContent}
            link={link}
            ariaLabel={getIconAriaLabel(label, displayCount)}
            shouldScaleStroke={false}
            withShadow={false}
          />
          {typeof displayCount === 'number' && (
            <span className={styles.badge} data-testid={TEST_ID_BADGE}>
              {getIconBadgeLabel(displayCount)}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default LoginSocialBarIcons;
