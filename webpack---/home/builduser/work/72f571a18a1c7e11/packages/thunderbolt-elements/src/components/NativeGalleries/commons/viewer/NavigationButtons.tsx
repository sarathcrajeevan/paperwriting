import * as React from 'react';
import classNames from 'classnames';
import { TestIds, translations } from '../constants';
import { INavigationButtonsProps } from '../GalleriesCommons.types';
import { GalleryCounter } from './GalleryCounter';

export const NavigationButtons: React.FunctionComponent<INavigationButtonsProps> =
  ({
    translate,
    skinsStyle,
    moveToPrevItem,
    moveToNextItem,
    withCounter = false,
    currentIndex,
    itemsLength,
    reverse,
    buttonPrevContent,
    buttonNextContent,
  }) => {
    const prevButtonAriaLabel = translate!(
      translations.ARIA_LABEL_NAMESPACE,
      translations.PREV_BUTTON_ARIA_LABEL_KEY,
      translations.PREV_BUTTON_ARIA_LABEL_DEFAULT,
    );
    const nextButtonAriaLabel = translate!(
      translations.ARIA_LABEL_NAMESPACE,
      translations.NEXT_BUTTON_ARIA_LABEL_KEY,
      translations.NEXT_BUTTON_ARIA_LABEL_DEFAULT,
    );

    return (
      <nav
        aria-label={translate!(
          translations.ARIA_LABEL_NAMESPACE,
          translations.NAVIGATION_BUTTONS_ARIA_LABEL_KEY,
          translations.NAVIGATION_BUTTONS_ARIA_LABEL_DEFAULT,
        )}
        className={skinsStyle.navButtons}
        data-testid={TestIds.navButtons}
      >
        <button
          className={classNames(skinsStyle.navButton, skinsStyle.buttonPrev)}
          data-testid={TestIds.prevButton}
          type="button"
          aria-label={reverse ? nextButtonAriaLabel : prevButtonAriaLabel}
          onClick={reverse ? moveToNextItem : moveToPrevItem}
        >
          <span
            className={skinsStyle.arrow}
            data-testid={TestIds.prevButtonInner}
            role="presentation"
            aria-hidden="true"
          >
            {buttonPrevContent}
          </span>
        </button>
        {withCounter && (
          <GalleryCounter
            skinsStyle={skinsStyle}
            currentIndex={currentIndex}
            itemsLength={itemsLength}
          />
        )}
        <button
          className={classNames(skinsStyle.navButton, skinsStyle.buttonNext)}
          data-testid={TestIds.nextButton}
          type="button"
          aria-label={reverse ? prevButtonAriaLabel : nextButtonAriaLabel}
          onClick={reverse ? moveToPrevItem : moveToNextItem}
        >
          <span
            className={skinsStyle.arrow}
            data-testid={TestIds.nextButtonInner}
            role="presentation"
            aria-hidden="true"
          >
            {buttonNextContent}
          </span>
        </button>
      </nav>
    );
  };
