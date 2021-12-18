import * as React from 'react';
import classNames from 'classnames';
import Link from '../../../../Link/viewer/Link';
import { activateBySpaceOrEnterButton } from '../../../../../core/commons/a11y';
import { isEmptyObject } from '../../../../../core/commons/utils';
import { ItemClickActionWrapperProps } from '../../GalleriesCommons.types';
import { translations, TestIds } from '../../constants';

const ItemClickActionWrapper: React.FC<ItemClickActionWrapperProps> = props => {
  const {
    imageOnClickAction,
    openImageZoom,
    focusItemRoot,
    focusDisabledItems = false,
    imgTitle,
    imgAlt,
    link,
    children,
    skinsStyle,
    itemId,
    translate,
    onFocus = () => {},
    onBlur = () => {},
  } = props;

  const describedbyId = `describedby_${itemId}`;

  const imageZoomDescribedByLabel = translate!(
    translations.ARIA_LABEL_NAMESPACE,
    translations.IMAGE_ZOOM_ARIA_LABEL_KEY,
    translations.IMAGE_ZOOM_ARIA_LABEL_DEFAULT,
  );

  const onZoomClick = () => {
    if (focusItemRoot) {
      focusItemRoot();
    }

    openImageZoom();
  };

  switch (imageOnClickAction) {
    case 'zoomMode':
      return (
        <div
          className={classNames(
            skinsStyle.itemClickWrapper,
            skinsStyle.imageZoomBtn,
          )}
          data-testid={TestIds.imageZoomBtn}
          role="button"
          aria-haspopup="dialog"
          tabIndex={0}
          aria-label={imgAlt || imgTitle || undefined}
          aria-describedby={describedbyId}
          onClick={onZoomClick}
          onKeyDown={activateBySpaceOrEnterButton}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {children}
          <div style={{ display: 'none' }}>
            <span id={describedbyId} data-testid={TestIds.ariaDescribedbyId}>
              {imageZoomDescribedByLabel}
            </span>
          </div>
        </div>
      );
    case 'goToLink':
      if (!isEmptyObject(link)) {
        return (
          <Link
            className={classNames(
              skinsStyle.itemClickWrapper,
              skinsStyle.imageLink,
            )}
            dataTestId={TestIds.link}
            {...(focusDisabledItems ? { tabIndex: 0 } : {})}
            {...link}
          >
            {children}
          </Link>
        );
      } else {
        break;
      }
    default:
  }

  return (
    <div
      className={skinsStyle.itemClickWrapper}
      role="img"
      data-testid={TestIds.disabledClickActionWrapper}
      {...(focusDisabledItems ? { tabIndex: 0 } : {})}
    >
      {children}
    </div>
  );
};

export default ItemClickActionWrapper;
