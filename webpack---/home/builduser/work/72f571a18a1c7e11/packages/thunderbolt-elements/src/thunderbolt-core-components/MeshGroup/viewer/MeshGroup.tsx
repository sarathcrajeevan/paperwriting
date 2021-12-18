import * as React from 'react';
import MeshContainer from '../../MeshContainer/viewer/MeshContainer';
import { IMeshGroupProps } from '../MeshGroup';

const MeshGroup: React.FC<IMeshGroupProps> = ({
  id,
  meshProps,
  children,
  className = '',
}) => {
  return (
    <div id={id} className={className}>
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </div>
  );
};

export default MeshGroup;
