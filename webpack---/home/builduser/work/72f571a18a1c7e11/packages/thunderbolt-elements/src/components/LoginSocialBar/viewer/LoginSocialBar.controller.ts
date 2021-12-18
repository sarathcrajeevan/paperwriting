import { IComponentController } from '@wix/editor-elements-types';

const mapActionsToProps: IComponentController = ({ updateProps }) => {
  return {
    onMenuOpen: () => {
      updateProps({
        isMenuOpen: true,
      });
    },
    onMenuClose: () => {
      updateProps({
        isMenuOpen: false,
      });
    },
  };
};

export default mapActionsToProps;
