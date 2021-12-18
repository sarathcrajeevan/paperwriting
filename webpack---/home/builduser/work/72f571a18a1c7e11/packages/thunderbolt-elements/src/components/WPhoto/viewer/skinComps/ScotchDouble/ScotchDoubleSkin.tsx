import * as React from 'react';
import { WPhotoWrapper } from '../../WPhotoWrapper';
import Link from '../../../../Link/viewer/Link';
import { BaseWPhotoSkinProps } from '../../../WPhoto.types';
import { isEmptyObject } from '../../../../../core/commons/utils';
import { selectProperComponent, getPropsForLink } from '../../../utils';

const ScotchDoubleSkin: React.FC<BaseWPhotoSkinProps> = ({
  skinsStyle,
  id,
  link,
  imageProps,
  title,
  onClick,
  hasPlatformClickHandler = false,
  onClickBehavior,
  onDblClick,
  onMouseEnter,
  onMouseLeave,
  filterEffectSvgUrl,
}) => {
  const ImageComp = selectProperComponent(onClickBehavior);
  const isPopUp = onClickBehavior === 'zoomMode';
  const linkProps = getPropsForLink({
    onClickBehavior,
    className: skinsStyle.link,
    link,
  });

  return (
    <WPhotoWrapper
      id={id}
      className={skinsStyle.root}
      onClick={onClick}
      onDblClick={onDblClick}
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      withOnClickHandler={
        !isEmptyObject(link) || hasPlatformClickHandler || isPopUp
      }
      filterEffectSvgUrl={filterEffectSvgUrl}
    >
      <Link {...linkProps}>
        <ImageComp
          id={`img_${id}`}
          {...imageProps}
          className={skinsStyle.image}
          link={isPopUp ? link : undefined}
        />
      </Link>
      <div className={skinsStyle.ScotchA} />
      <div className={skinsStyle.ScotchB} />
    </WPhotoWrapper>
  );
};

export default ScotchDoubleSkin;
