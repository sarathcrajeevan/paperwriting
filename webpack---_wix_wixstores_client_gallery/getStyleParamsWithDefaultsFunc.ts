/* eslint-disable import/no-cycle */
import {IGalleryStyleParams} from './types/galleryTypes';
import {getDefaultStyleParams} from './viewerScript/getDefaultStyleParams';

export function getStyleParamsWithDefaultsFunc({style: {styleParams}, dimensions}) {
  const overrides = {numbers: {}, booleans: {}, ...styleParams};

  ['galleryColumns', 'galleryRows', 'galleryMargin'].forEach((key) => {
    if (overrides.numbers[key] !== undefined) {
      overrides.numbers[key] = Math.round(overrides.numbers[key]);
    }
  });

  const {
    booleans: {showAlternativeImage, responsive: isEditorX},
    numbers: {galleryColumns},
  } = overrides as IGalleryStyleParams;

  const defaults = getDefaultStyleParams({
    showAlternativeImage: showAlternativeImage === undefined ? true : showAlternativeImage,
    galleryColumns,
    dimensions,
    isEditorX,
  });

  return {defaults, overrides};
}
