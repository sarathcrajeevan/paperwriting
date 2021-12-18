function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

import * as utils from './utils';

var formatTextLinkToObject = function formatTextLinkToObject(link, target) {
    switch (typeof link) {
        case 'object':
            return {
                type: 'wix',
                data: link
            };

        case 'string':
            return {
                type: 'web',
                url: link,
                target: target
            };

        default:
            return {
                target: '_blank',
                type: 'none'
            };
    }
};

var formatObjectLinkToText = function formatObjectLinkToText(link) {
    if (link === void 0) {
        link = {};
    }

    // todo - update defs from here: https://www.wix.com/code/reference/$w.LinkableMixin.html#link
    var _link = {
        link: link.url
    };

    if (link.url) {
        _link.target = link.target;
    }

    return _link;
};

var isMediaSrc = function isMediaSrc(src) {
    var regex = /^(wix:)?(image|video)(:\/\/)/;
    return regex.exec(src) !== null;
};

var isValidImage = function isValidImage(src) {
    var regex = /^.*\.(jpeg|jpg|webp|png|jpe)$/;
    return regex.exec(src) !== null;
};

var formatSrcToMediaUrl = function formatSrcToMediaUrl(src) {
    return isMediaSrc(src) ? src.split('/')[3] : src; // convert from wix:image://v1/[mediaUrl]/
};

var formatSrcToFilename = function formatSrcToFilename(src) {
    try {
        return isMediaSrc(src) ? src.split('/')[4].split('#').slice(0, -1).join('#') : '_.jpg'; // convert from wix:image://v1/[mediaUrl]/
    } catch (e) {
        return '_.jpg';
    }
};

var formatImageUrlToSrc = function formatImageUrlToSrc(mediaUrl, meta) {
    return "wix:image://v1/" + (mediaUrl || utils.slugify(meta.name)) + "/" + utils.slugify(meta.fileName || meta.name) + "#originWidth=" + meta.width + "&originHeight=" + meta.height;
};

var formatVideoUrlToSrc = function formatVideoUrlToSrc(videoUrl, meta) {
    return "wix:video://v1/" + (videoUrl || utils.slugify(meta.name)) + "/" + utils.slugify(meta.fileName || meta.name) + "#posterUri=" + meta.posters[0].url + "&posterWidth=" + meta.width + "&posterHeight=" + meta.height;
};

var dimensionsFromUrl = function dimensionsFromUrl(url) {
    var dimensions = {};
    var foundDimensions = false; // try {
    //   // dimensions from url
    //   const regex = /\/w_\d*,h_\d*\//; //this is for urls that are not usual wixCode urls but older ones - this was never inserted to the master.
    //   const match = regex.exec(url);
    //   if (match && match[0] && match[0].length > 0) {
    //     const [originWidth, originHeight] = match[0]
    //       .replace(/\//g, '')
    //       .replace(/_/g, '')
    //       .replace(/[a-z]/g, '')
    //       .split(',')
    //       .map((i) => Number(i));
    //     if (originWidth > 0 && originHeight > 0) {
    //       foundDimensions = true;
    //       dimensions = {
    //         originWidth,
    //         originHeight,
    //       };
    //     }
    //   }
    // } catch (e) {
    //   foundDimensions = false;
    // }

    try {
        // dimensions from url
        var regex = /\/\d*_\d*\//;
        var match = regex.exec(url);

        if (match && match[0] && match[0].length > 0) {
            var _match$0$replace$spli = match[0].replace(/\//g, '').split('_').map(function(i) {
                    return Number(i);
                }),
                originWidth = _match$0$replace$spli[0],
                originHeight = _match$0$replace$spli[1];

            if (originWidth > 0 && originHeight > 0) {
                foundDimensions = true;
                dimensions = {
                    originWidth: originWidth,
                    originHeight: originHeight
                };
            }
        }
    } catch (e) {
        foundDimensions = false;
    }

    if (!foundDimensions) {
        try {
            var wmRegex = /wm_(.*)\//;
            var wmMatch = wmRegex.exec(url);

            if (wmMatch && wmMatch[0] && wmMatch[0].length > 0) {
                var watermark = wmMatch[1];

                if (watermark.length > 0) {
                    dimensions.watermark = watermark;
                }
            }
        } catch (e) {
            foundDimensions = false;
        }
    }

    if (!foundDimensions) {
        /*
        Breaks a url of this format : wix:image://v1/<uri>/<filename>#originWidth=<width>&originHeight=<height>[&watermark=<watermark_manifest_string>]
        to a hash like this  {
          originWidth: <width>
          originHeight: <height>
          watermark: <watermark_manifest_string>
          token: <token_string>
        }
        */
        try {
            // dimensions from hash
            url.split('#').pop().split('&').map(function(dim) {
                return dim.split('=');
            }).forEach(function(dim) {
                dimensions[dim[0]] = isNaN(Number(dim[1])) ? String(dim[1]) : Number(dim[1]);
            });
        } catch (e) {
            foundDimensions = false;
        }
    }

    return dimensions;
};

var oldWixCodeItemToProGallery = function oldWixCodeItemToProGallery(wixCodeItem, i) {
    return {
        itemId: utils.createUniqueUuidFromString(i + '_' + (wixCodeItem.uri || wixCodeItem.alt || i)),
        mediaUrl: wixCodeItem.uri || '',
        metaData: {
            height: wixCodeItem.height || 1,
            lastModified: Date.now(),
            link: formatTextLinkToObject(wixCodeItem.link, wixCodeItem.target),
            title: wixCodeItem.title || '',
            description: wixCodeItem.description || '',
            alt: wixCodeItem.alt || '',
            sourceName: 'private',
            tags: [],
            width: wixCodeItem.width || 1
        },
        orderIndex: i
    };
};

var newWixCodeItemToProGallery = function newWixCodeItemToProGallery(wixCodeItem, i) {
    var dimensions = dimensionsFromUrl(wixCodeItem.src);
    dimensions.width = wixCodeItem.width || dimensions.originWidth || dimensions.originalWidth || dimensions.posterWidth || 1;
    dimensions.height = wixCodeItem.height || dimensions.originHeight || dimensions.originalHeight || dimensions.posterHeight || 1;
    var focalPoint = wixCodeItem.settings && wixCodeItem.settings.focalPoint; // dimensions already contains all url params so we use it to get the token too
    // TODO: parse watermark and token in a seperate function

    var watermarkStr = dimensions.watermark;
    var imageToken = wixCodeItem.imageToken || wixCodeItem.token || dimensions.token;
    var type = (wixCodeItem.type || 'image').toLowerCase();

    var item = _objectSpread({
        itemId: utils.slugify(wixCodeItem.slug) || (utils.slugify(wixCodeItem.title || wixCodeItem.id) || utils.createUniqueUuidFromString(wixCodeItem.src || wixCodeItem.html || i)) + '_' + i,
        mediaUrl: formatSrcToMediaUrl(wixCodeItem.src),
        metaData: Object.assign({
            type: type,
            alt: wixCodeItem.alt || '',
            title: wixCodeItem.title || '',
            description: wixCodeItem.description || '',
            name: formatSrcToFilename(wixCodeItem.src),
            fileName: formatSrcToFilename(wixCodeItem.src),
            link: formatTextLinkToObject(wixCodeItem.link, wixCodeItem.target),
            width: dimensions.width,
            height: dimensions.height,
            sourceName: 'private'
        }, focalPoint ? {
            focalPoint: focalPoint
        } : {}, watermarkStr ? {
            watermarkStr: watermarkStr
        } : {}),
        orderIndex: i
    }, imageToken && {
        token: imageToken
    });

    if (type === 'text') {
        var style = wixCodeItem.style;
        item.metaData.height = dimensions.height || 500;
        item.metaData.width = dimensions.width || 500 * style.layoutRatio;
        item.metaData.textStyle = {
            width: item.metaData.width,
            height: item.metaData.height,
            backgroundColor: style.fillColor
        };
        item.metaData.html = item.editorHtml = wixCodeItem.html;
    }

    if (type === 'video') {
        var thumbnailDimensions = {};

        if (wixCodeItem.thumbnail) {
            thumbnailDimensions = dimensionsFromUrl(wixCodeItem.thumbnail);
        }

        var url = isValidImage(formatSrcToMediaUrl(wixCodeItem.thumbnail)) ? formatSrcToMediaUrl(wixCodeItem.thumbnail) : dimensions.posterUri;
        item.metaData.posters = [{
            url: url,
            width: thumbnailDimensions.width || dimensions.width,
            height: thumbnailDimensions.height || dimensions.height
        }];
        item.isExternal = wixCodeItem.src.indexOf('http') === 0;

        if (item.isExternal || isMediaSrc(wixCodeItem.src)) {
            item.metaData.source = wixCodeItem.src.indexOf('youtube.com') > 0 ? 'youtube' : wixCodeItem.src.indexOf('vimeo.com') > 0 ? 'vimeo' : 'wix';
            item.metaData.videoUrl = wixCodeItem.src;
        } else {
            item.metaData.qualities = [{
                width: dimensions.width,
                height: dimensions.height,
                quality: dimensions.height + 'p',
                formats: [isMediaSrc(wixCodeItem.src) ? 'wix' : wixCodeItem.src.split(/#|\?/)[0].split('.').pop().trim()]
            }];
        }
    }

    return item;
};

var isNewWixCodeItemFormat = function isNewWixCodeItemFormat(wixCodeItem) {
    return !!(wixCodeItem.src || wixCodeItem.type && wixCodeItem.html);
};

export var wixCodeItemToProGallery = function wixCodeItemToProGallery(wixCodeItem, i) {
    if (i === void 0) {
        i = 0;
    }

    return isNewWixCodeItemFormat(wixCodeItem) ? newWixCodeItemToProGallery(wixCodeItem, i) : oldWixCodeItemToProGallery(wixCodeItem, i);
};
export var wixCodeItemsToProGallery = function wixCodeItemsToProGallery(wixCodeItems) {
    var formattedItemsDto = [];

    try {
        wixCodeItems.forEach(function(wixCodeItem, i) {
            return formattedItemsDto.push(wixCodeItemToProGallery(wixCodeItem, i));
        }); // console.log('Converted wix code items', wixCodeItems, formattedItemsDto);
    } catch (e) {
        console.error('Wrong format for gallery items', wixCodeItems, e);
    }

    return formattedItemsDto;
};

var proGalleryItemToOldWixCode = function proGalleryItemToOldWixCode(itemDto) {
    var meta = itemDto.metaData || itemDto.metadata || {};
    var link = formatObjectLinkToText(meta.link) || {};
    return _objectSpread({
        uri: itemDto.mediaUrl,
        description: meta.description,
        alt: meta.alt,
        title: meta.title,
        height: meta.height,
        width: meta.width
    }, link);
}; // gallery-type editor: convert from orginaize-media to wix-code


var proGalleryItemToNewWixCode = function proGalleryItemToNewWixCode(item) {
    if (item === void 0) {
        item = {};
    }

    var meta = item.metaData || item.metadata || {};
    var link = formatObjectLinkToText(meta.link) || {};

    var dbItem = _objectSpread({
        type: meta.type || 'image',
        slug: item.itemId
    }, link);

    var type = dbItem.type.toLowerCase();

    if (type === 'text') {
        var style = meta.testStyle || {};
        Object.assign(dbItem, {
            html: meta.html,
            style: {
                width: style.width,
                height: style.height,
                bgColor: style.backgroundColor
            }
        });
    } else {
        Object.assign(dbItem, {
            title: meta.title,
            description: meta.description,
            alt: meta.alt
        });

        if (type === 'image') {
            Object.assign(dbItem, _objectSpread(_objectSpread({
                src: formatImageUrlToSrc(item.mediaUrl, meta),
                settings: Object.assign({}, meta.focalPoint ? {
                    focalPoint: meta.focalPoint
                } : {})
            }, 'imageToken' in item && {
                imageToken: item.imageToken
            }), 'token' in item && {
                token: item.token
            }));
        } else if (type === 'video') {
            Object.assign(dbItem, {
                src: formatVideoUrlToSrc(item.mediaUrl, meta),
                thumbnail: meta.posters[0].url
            });
        }
    }

    return dbItem;
};

export var proGalleryItemToWixCode = function proGalleryItemToWixCode(item, isNew) {
    if (item === void 0) {
        item = {};
    }

    if (isNew === void 0) {
        isNew = true;
    }

    return isNew ? proGalleryItemToNewWixCode(item) : proGalleryItemToOldWixCode(item);
};
export var proGalleryItemsToWixCode = function proGalleryItemsToWixCode(itemsDto, isNew) {
    if (isNew === void 0) {
        isNew = true;
    }

    var formattedItemsDto = [];
    itemsDto.forEach(function(itemDto) {
        return formattedItemsDto.push(proGalleryItemToWixCode(itemDto, isNew));
    });
    return formattedItemsDto;
};