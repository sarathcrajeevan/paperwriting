import * as React from 'react';
import classNames from 'classnames';
import {
  ISlideShowGalleryImperativeActions,
  SlideShowGallerySkinProps,
} from '../SlideShowGallery.types';
import { TestIds, translations } from '../constants';
import { useGesture } from '../../../../providers/useGesture/useGesture';
import { useInViewport } from '../../../../providers/useInViewport/useInViewport';
import { useInterval } from '../../../../providers/useInterval/useInterval';
import SlideShowGalleryItem from '../../SlideShowGalleryItem/viewer/SlideShowGalleryItem';
import { keyCodes } from '../../../../core/commons/a11y';
import { NavigationButtons } from '../../commons/viewer/NavigationButtons';
import { GalleryCounter } from '../../commons/viewer/GalleryCounter';
import { generateItemIndexString } from '../../commons/itemUtils';
import SlideShowGalleryItemContainer from './SlideShowGalleryItemContainer';

const NO_TRANSITION = 'NoTransition';

const emptyFn = () => {};

const getPrevIndex = (currentIndex: number, itemsLength: number): number =>
  currentIndex === 0 ? itemsLength - 1 : currentIndex - 1;

const getNextIndex = (currentIndex: number, itemsLength: number): number =>
  currentIndex === itemsLength - 1 ? 0 : currentIndex + 1;

const getGhostIndexesForIndex = (
  index: number,
  itemsLength: number,
): Array<number> => [
  getPrevIndex(index, itemsLength),
  index,
  getNextIndex(index, itemsLength),
];

const SlideShowGallery: React.ForwardRefRenderFunction<
  ISlideShowGalleryImperativeActions,
  SlideShowGallerySkinProps
> = (props, ref) => {
  const {
    id,
    items,
    skinsStyle,
    skinsItemStyle,
    currentIndex,
    setCurrentIndex,
    onCurrentItemChanged,
    overlay,
    autoPlay,
    autoPlayInterval,
    setAutoPlay,
    reducedMotion,
    transition,
    transitionDuration,
    openImageZoom = emptyFn,
    onMouseEnter = emptyFn,
    onMouseLeave = emptyFn,
    imageOnClickAction,
    showAutoplay,
    showNavigation,
    showCounter,
    translate,
    onNavigationEnd,
    onPlay = emptyFn,
    onPause = emptyFn,
    isPlaying: canPlay = autoPlay && items.length > 1 && !reducedMotion,
    transitionReverse: reverse,
    alignTextRight,
    onItemClicked,
    renderNavigationButtonsInHelpers = false,
    imageMode,
    panelInImageWrapper,
  } = props;
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const isGalleryInViewport = useInViewport(galleryRef);
  const isPlaying = canPlay && isGalleryInViewport;
  const [inTransition, setInTransition] = React.useState(false);
  const hasTransition = transition !== NO_TRANSITION;
  const currentItem = items[currentIndex];
  const [navigationReverse, setNavigationReverse] = React.useState(false);

  const setBackwardDirection = () => setNavigationReverse(true);
  const setForwardDirection = () => setNavigationReverse(false);

  const moveToItemImmediate = React.useCallback(
    (newItemIndex: number) => {
      setCurrentIndex(newItemIndex);
      onCurrentItemChanged?.({
        type: 'imageChanged',
        itemIndex: newItemIndex,
      });

      if (onNavigationEnd) {
        onNavigationEnd(newItemIndex);
      }
    },
    [setCurrentIndex, onCurrentItemChanged, onNavigationEnd],
  );

  const moveToItemWithTransition = React.useCallback(
    (newItemIndex: number) => {
      if (inTransition) {
        return;
      }

      setInTransition(true);
      setCurrentIndex(newItemIndex);
      onCurrentItemChanged?.({
        type: 'imageChanged',
        itemIndex: newItemIndex,
      });
    },
    [inTransition, setCurrentIndex, onCurrentItemChanged],
  );

  const onTransitionEnd = React.useCallback(() => {
    setInTransition(false);

    if (onNavigationEnd) {
      onNavigationEnd(currentIndex);
    }
  }, [currentIndex, setInTransition, onNavigationEnd]);

  const moveToItem = React.useCallback(
    (newItemIndex: number) =>
      hasTransition
        ? moveToItemWithTransition(newItemIndex)
        : moveToItemImmediate(newItemIndex),
    [moveToItemImmediate, moveToItemWithTransition, hasTransition],
  );

  const moveToNextItem = React.useCallback(() => {
    const newItemIndex = getNextIndex(currentIndex, items.length);

    setForwardDirection();
    return moveToItem(newItemIndex);
  }, [items.length, currentIndex, moveToItem]);

  const moveToPrevItem = React.useCallback(() => {
    const newItemIndex = getPrevIndex(currentIndex, items.length);

    setBackwardDirection();
    return moveToItem(newItemIndex);
  }, [items.length, currentIndex, moveToItem]);

  const handleNavigationByKey: React.KeyboardEventHandler<HTMLDivElement> =
    event => {
      if (event.keyCode === keyCodes.arrowRight) {
        moveToNextItem();
      } else if (event.keyCode === keyCodes.arrowLeft) {
        moveToPrevItem();
      }
    };

  const play = React.useCallback(() => {
    onPlay?.({ type: 'autoplayOn' });
    setAutoPlay(true);
  }, [onPlay, setAutoPlay]);

  const pause = React.useCallback(() => {
    onPause?.({ type: 'autoplayOff' });
    setAutoPlay(false);
  }, [onPause, setAutoPlay]);

  const togglePlay = () => {
    // user clicked pause
    if (autoPlay) {
      pause();
      // user clicked play
    } else {
      play();
    }
  };

  const itemClickHandler = () => {
    onItemClicked?.({
      itemIndex: currentIndex,
      type: 'itemClicked',
    });
  };

  const openImageZoomAndPausePlayIfNeeded = (dataId: string) => {
    if (isPlaying) {
      pause();
      openImageZoom(dataId, id, play);
    } else {
      openImageZoom(dataId, id);
    }
  };

  const getNavigationButtonsOrCounter = () => {
    if (showNavigation && renderNavigationButtonsInHelpers) {
      return (
        <NavigationButtons
          translate={translate}
          skinsStyle={skinsStyle}
          moveToPrevItem={moveToPrevItem}
          moveToNextItem={moveToNextItem}
          reverse={reverse}
          withCounter={showCounter}
          currentIndex={currentIndex}
          itemsLength={items.length}
        />
      );
    } else if (showCounter) {
      return (
        <GalleryCounter
          skinsStyle={skinsStyle}
          currentIndex={currentIndex}
          itemsLength={items.length}
        />
      );
    }
    return null;
  };

  useGesture(
    'onSwipeLeft',
    reverse ? moveToPrevItem : moveToNextItem,
    galleryRef,
  );
  useGesture(
    'onSwipeRight',
    reverse ? moveToNextItem : moveToPrevItem,
    galleryRef,
  );
  useInterval(
    reverse ? moveToPrevItem : moveToNextItem,
    isPlaying ? autoPlayInterval : null,
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        next: moveToNextItem,
        previous: moveToPrevItem,
        play,
        pause,
      };
    },
    [moveToNextItem, moveToPrevItem, play, pause],
  );

  const ghostItemsData = React.useRef({
    currentIndex,
    items,
    indexes: new Set(getGhostIndexesForIndex(currentIndex, items.length)),
  });

  if (ghostItemsData.current.items !== items) {
    ghostItemsData.current = {
      currentIndex,
      items,
      indexes: new Set(getGhostIndexesForIndex(currentIndex, items.length)),
    };
  } else if (ghostItemsData.current.currentIndex !== currentIndex) {
    ghostItemsData.current = {
      currentIndex,
      items,
      indexes: ghostItemsData.current.indexes,
    };

    const indexesToAdd = getGhostIndexesForIndex(currentIndex, items.length);
    for (const indexToAdd of indexesToAdd) {
      ghostItemsData.current.indexes.add(indexToAdd);
    }
  }

  const ghostItems = items
    .map((item, index) => ({ item, originalIndex: index }))
    .filter(({ originalIndex }) =>
      ghostItemsData.current.indexes.has(originalIndex),
    )
    .map(({ item, originalIndex }) => {
      return (
        <SlideShowGalleryItem
          key={`item-${originalIndex}`}
          dataTestId={TestIds.ghostItem}
          itemClickHandler={emptyFn}
          skinsStyle={skinsItemStyle}
          extraClassNames={{
            root: skinsStyle.item,
            panel: skinsStyle.panel,
          }}
          itemId={generateItemIndexString(originalIndex, id)}
          imageOnClickAction={imageOnClickAction}
          openImageZoom={emptyFn}
          translate={translate}
          alignTextRight={alignTextRight}
          imageMode={imageMode}
          panelInImageWrapper={panelInImageWrapper}
          {...item}
        />
      );
    });

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={id}
      data-testid={TestIds.root}
      data-image-mode={imageMode}
      ref={galleryRef}
      role="region"
      aria-label={translate!(
        translations.ARIA_LABEL_NAMESPACE,
        translations.SLIDE_SHOW_GALLERY_ARIA_LABEL_KEY,
        translations.SLIDE_SHOW_GALLERY_ARIA_LABEL_DEFAULT,
      )}
      className={classNames(skinsStyle.root, {
        [skinsStyle.textAlignmentRight]: alignTextRight,
      })}
      onKeyDown={handleNavigationByKey}
    >
      <div className={skinsStyle.ghostItems}>{ghostItems}</div>
      {showNavigation && !renderNavigationButtonsInHelpers && (
        <NavigationButtons
          translate={translate}
          skinsStyle={skinsStyle}
          moveToPrevItem={moveToPrevItem}
          moveToNextItem={moveToNextItem}
          reverse={reverse}
          withCounter={false}
        />
      )}
      {currentItem && (
        <SlideShowGalleryItemContainer
          skinsStyle={skinsStyle}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          transition={transition}
          transitionDuration={transitionDuration}
          reverse={navigationReverse}
          onTransitionEnd={onTransitionEnd}
        >
          <SlideShowGalleryItem
            key={
              imageMode === 'flexibleWidthFixed'
                ? `item-${currentIndex}${currentItem.title}`
                : undefined
            }
            dataTestId={TestIds.item}
            itemClickHandler={itemClickHandler}
            skinsStyle={skinsItemStyle}
            extraClassNames={{
              root: skinsStyle.item,
              panel: skinsStyle.panel,
            }}
            imageOnClickAction={imageOnClickAction}
            openImageZoom={openImageZoomAndPausePlayIfNeeded}
            translate={translate}
            alignTextRight={alignTextRight}
            imageMode={imageMode}
            itemId={`item-current-${currentIndex}-${id}`}
            panelInImageWrapper={panelInImageWrapper}
            {...currentItem}
          />
        </SlideShowGalleryItemContainer>
      )}
      <div className={skinsStyle.helpers}>
        {showAutoplay && (
          <button
            className={classNames(
              skinsStyle.playButton,
              isPlaying ? skinsStyle.autoplayOn : skinsStyle.autoplayOff,
            )}
            data-testid={TestIds.playButton}
            type="button"
            aria-label={translate!(
              translations.ARIA_LABEL_NAMESPACE,
              translations.PLAY_BUTTON_ARIA_LABEL_KEY,
              translations.PLAY_BUTTON_ARIA_LABEL_DEFAULT,
            )}
            aria-pressed={isPlaying}
            onClick={togglePlay}
          >
            <span
              className={skinsStyle.playIcon}
              data-testid={TestIds.playButtonInner}
              role="presentation"
              aria-hidden="true"
            />
          </button>
        )}
        {getNavigationButtonsOrCounter()}
      </div>
      {overlay}
    </div>
  );
};

export default React.forwardRef(SlideShowGallery);
