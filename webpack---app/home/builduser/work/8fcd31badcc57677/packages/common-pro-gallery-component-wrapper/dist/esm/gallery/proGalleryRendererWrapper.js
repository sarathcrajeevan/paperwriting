import React from 'react';
import {
    ProGalleryRenderer
} from 'pro-gallery';
export var ProGalleryRendererWrapper = function(props) {
    var structure = props.structure;
    var container = props.container;
    var items = props.items;
    var scrollingElement = props.scrollingElement;
    var createMediaUrl = props.createMediaUrl;
    var eventsListener = props.eventsListener;
    var customComponents = props.customComponents;
    return (React.createElement(ProGalleryRenderer, {
        key: "pro-gallery",
        id: props.id,
        structure: structure,
        container: container,
        options: props.options,
        items: items,
        totalItemsCount: props.totalItemsCount,
        deviceType: props.deviceType,
        viewMode: props.viewMode,
        scrollingElement: scrollingElement,
        createMediaUrl: createMediaUrl,
        isPrerenderMode: props.isPrerenderMode,
        customComponents: customComponents,
        eventsListener: eventsListener,
        settings: props.settings,
        proGalleryRole: "application",
        translations: props.translations,
        enableExperimentalFeatures: props.enableExperimentalFeatures
    }));
};
//# sourceMappingURL=proGalleryRendererWrapper.js.map