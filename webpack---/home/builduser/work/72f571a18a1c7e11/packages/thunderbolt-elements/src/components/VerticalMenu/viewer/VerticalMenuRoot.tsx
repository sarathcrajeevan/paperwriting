import * as React from 'react';
import { VerticalMenuProps, LogicProps } from '../VerticalMenu.types';
import extendItemsWithSelectionProp from './utils/extendItemsWithSelectionProp';
import filterVisibleItems from './utils/filterVisibleItems';
import * as translations from './constants';
import VerticalMenuCommonSkin from './skinComps/VerticalMenuCommonSkin';

const VerticalMenuRoot: React.FC<VerticalMenuProps & LogicProps> = props => {
  const {
    translate,
    items = [],
    style,
    separatedButton,
    currentPageHref,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const visibleItems = React.useMemo(() => filterVisibleItems(items), [items]);
  const itemsWithSelectionProp = React.useMemo(
    () => extendItemsWithSelectionProp(currentPageHref, visibleItems),
    [currentPageHref, visibleItems],
  );

  const ariaLabel = translate!(
    translations.ARIA_LABEL_NAMESPACE,
    translations.ARIA_LABEL_KEY,
    translations.ARIA_LABEL_DEFAULT,
  );

  return (
    <VerticalMenuCommonSkin
      {...props}
      items={itemsWithSelectionProp}
      ariaLabel={ariaLabel}
      style={style}
      separatedButton={separatedButton}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default VerticalMenuRoot;
