import { BadgeLayout, BadgeSize } from '../../types';

type Boundaries = { min: number; max: number };

type BadgeSizeMap<T> = { [key in BadgeSize]: T };

type BadgeLayoutMap<T> = { [key in BadgeLayout]: T };

type CornerRadiusMap = BadgeLayoutMap<BadgeSizeMap<Boundaries>>;

const cornerRadiusMap: CornerRadiusMap = {
  [BadgeLayout.NameAndIcon]: {
    [BadgeSize.Small]: { min: 0, max: 10 },
    [BadgeSize.Medium]: { min: 0, max: 10 },
    [BadgeSize.Large]: { min: 0, max: 16 },
  },
  [BadgeLayout.NameOnly]: {
    [BadgeSize.Small]: { min: 0, max: 10 },
    [BadgeSize.Medium]: { min: 0, max: 10 },
    [BadgeSize.Large]: { min: 0, max: 16 },
  },
  [BadgeLayout.IconOnly]: {
    [BadgeSize.Small]: { min: 0, max: 16 },
    [BadgeSize.Medium]: { min: 0, max: 18 },
    [BadgeSize.Large]: { min: 0, max: 20 },
  },
};

export const getCornerRadiusBoundaries = (
  layout: BadgeLayout,
  size: BadgeSize,
) => cornerRadiusMap[layout][size];
