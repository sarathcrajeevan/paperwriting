import { IComponentController } from '@wix/editor-elements-types';
import { ISlideShowGalleryControllerActions } from '../SlideShowGallery.types';

const mapActionsToProps: IComponentController = ({
  updateProps,
}): ISlideShowGalleryControllerActions => ({
  setCurrentIndex: (itemIndex: number) => {
    updateProps({
      currentIndex: itemIndex,
    });
  },
  setAutoPlay: (autoPlay: boolean) => {
    updateProps({
      autoPlay,
    });
  },
});

export default mapActionsToProps;
