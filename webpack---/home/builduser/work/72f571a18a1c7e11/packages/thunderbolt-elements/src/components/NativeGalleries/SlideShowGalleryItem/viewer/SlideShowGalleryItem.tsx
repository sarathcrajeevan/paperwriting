import * as React from 'react';
import classNames from 'classnames';
import Image from '../../../Image/viewer/Image';
import { SlideShowGalleryItemProps } from '../SlideShowGalleryItem.types';
import { TestIds } from '../../commons/constants';
import ItemClickActionWrapper from '../../commons/viewer/ItemClickActionWrapper/ItemClickActionWrapper';
import ImageSizer from '../../commons/viewer/ImageSizer/ImageSizer';

const SlideShowGalleryItem = (props: SlideShowGalleryItemProps) => {
  const {
    dataId,
    title,
    description,
    link,
    image,
    itemId,
    skinsStyle,
    extraClassNames,
    imageOnClickAction,
    openImageZoom = () => {},
    translate,
    alignTextRight,
    itemClickHandler,
    imageMode,
    dataTestId,
    panelInImageWrapper,
  } = props;

  const openImageZoomCallback = React.useCallback(
    () => openImageZoom(dataId),
    [dataId, openImageZoom],
  );

  const textPanel = (
    <div
      data-testid={TestIds.panel}
      className={classNames(skinsStyle.panel, extraClassNames.panel)}
    >
      <div data-testid={TestIds.title} className={skinsStyle.title}>
        {title}
      </div>
      <p data-testid={TestIds.description} className={skinsStyle.description}>
        {description}
      </p>
    </div>
  );

  return (
    <div
      className={classNames(skinsStyle.root, extraClassNames.root, {
        [skinsStyle.textAlignmentRight]: alignTextRight,
      })}
      data-testid={dataTestId}
      data-image-mode={imageMode}
      onClick={itemClickHandler}
    >
      <ItemClickActionWrapper
        imageOnClickAction={imageOnClickAction}
        openImageZoom={openImageZoomCallback}
        imgTitle={image.title || ''}
        link={link}
        imgAlt={image.alt}
        itemId={itemId}
        skinsStyle={skinsStyle}
        translate={translate}
      >
        {imageMode === 'flexibleHeight' && (
          <svg
            className={skinsStyle.aspectRatioSizer}
            viewBox={`0 0 ${image.width} ${image.height}`}
          />
        )}
        <ImageSizer
          className={skinsStyle.imageSizer}
          isFitMode={imageMode === 'flexibleWidthFixed'}
          imageWidth={image.width}
          imageHeight={image.height}
        >
          <div className={skinsStyle.imageWrapper}>
            <div className={skinsStyle.imageBorder}>
              <Image
                className={skinsStyle.image}
                id={`img_${image.containerId}`}
                {...image}
                alt={image.alt || (image.title as string)}
                displayMode="fill"
              />
            </div>
            {panelInImageWrapper && textPanel}
          </div>
        </ImageSizer>
        {!panelInImageWrapper && textPanel}
      </ItemClickActionWrapper>
    </div>
  );
};

export default SlideShowGalleryItem;
