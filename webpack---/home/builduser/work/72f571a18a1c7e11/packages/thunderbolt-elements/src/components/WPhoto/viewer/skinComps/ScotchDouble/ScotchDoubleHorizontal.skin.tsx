import * as React from 'react';
import WPhoto from '../../WPhotoBase';
import { SkinWPhotoProps } from '../SkinWPhoto';
import { BaseWPhotoSkinProps } from '../../../WPhoto.types';
import skinsStyles from './styles/ScotchDoubleHorizontal.scss';
import ScotchDoubleSkin from './ScotchDoubleSkin';

const ScotchDoubleHorizontalSkin: React.FC<
  Omit<BaseWPhotoSkinProps, 'skinsStyle'>
> = props => <ScotchDoubleSkin {...props} skinsStyle={skinsStyles} />;

const ScotchDoubleHorizontal: React.FC<SkinWPhotoProps> = props => (
  <WPhoto {...props} skin={ScotchDoubleHorizontalSkin} />
);

export default ScotchDoubleHorizontal;
