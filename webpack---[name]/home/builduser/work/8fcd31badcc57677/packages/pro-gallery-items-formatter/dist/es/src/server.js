var _excluded = ["type"];

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

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

/* eslint-disable no-unused-vars */

/* eslint-disable no-use-before-define */

/* eslint-disable array-callback-return */

/* eslint-disable no-debugger */
var mapResolutionsToWixVideoQualities = function mapResolutionsToWixVideoQualities(resolutions) {
    return resolutions.map(function(resolution) {
        return {
            formats: [Object.keys(resolution.urls)[0]],
            height: resolution.height,
            quality: resolution.videoMode || resolution.height + 'p',
            width: resolution.width
        };
    });
};

var createPhotoUrl = function createPhotoUrl(serverMediaUrl) {
    var mediaUrlStartIndex = serverMediaUrl.lastIndexOf('/');
    return serverMediaUrl.substring(mediaUrlStartIndex + 1);
};

var getLastUrlPath = function getLastUrlPath(url) {
    var splittedUrl = url.split('/');

    if (splittedUrl && splittedUrl.length > 0) {
        return splittedUrl.pop();
    }

    return '';
};

var extractMediaUrl = function extractMediaUrl(serverMediaUrl, serverUrlFormat) {
    var serverMediaUrlSplit = serverMediaUrl.split(serverUrlFormat);

    if (serverMediaUrlSplit && serverMediaUrlSplit.length === 2) {
        var serverMediaUrlSlashSplit = serverMediaUrlSplit.pop().split('/');

        if (serverMediaUrlSlashSplit.length > 0) {
            return serverMediaUrlSlashSplit[0];
        }
    }

    return '';
};

var wixMediaUrlFormats = ['video.wixstatic.com/video/', // old format
    'static.wixstatic.com/media/video/' // new format
];

var getWixMediaUrlVideo = function getWixMediaUrlVideo(serverMediaUrl) {
    var serverUrlFormat = wixMediaUrlFormats.find(function(format) {
        return serverMediaUrl.includes(format);
    });
    return extractMediaUrl(serverMediaUrl, serverUrlFormat);
};

var mapProGalleryVideoPosters = function mapProGalleryVideoPosters(serverPosters, isCustomPoster) {
    return serverPosters.filter(function(poster) {
        if (!isCustomPoster && (!('default' in poster) || !poster["default"])) {
            return true;
        }

        if (isCustomPoster && ('default' in poster || !!poster["default"])) {
            return true;
        }

        return false;
    }).map(function(poster) {
        return {
            height: poster.height,
            width: poster.width,
            url: getLastUrlPath(poster.url)
        };
    });
};

var generateProGalleryLink = function generateProGalleryLink(serverLink) {
    var serverLinkFieldOptions = [{
        serverLinkField: 'phone',
        type: 'PhoneLink'
    }, {
        serverLinkField: 'email',
        type: 'EmailLink'
    }, {
        serverLinkField: 'document',
        type: 'DocumentLink'
    }, {
        serverLinkField: 'page',
        type: 'PageLink'
    }, {
        serverLinkField: 'external',
        type: 'ExternalLink'
    }, {
        serverLinkField: 'anchor',
        type: 'AnchorLink'
    }, {
        serverLinkField: 'dynamicPage',
        type: 'DynamicPageLink'
    }];
    var proGalleryserverLink = serverLinkFieldOptions.find(function(_ref) {
        var serverLinkField = _ref.serverLinkField;
        return serverLink.wixLinkData && serverLink.wixLinkData["" + serverLinkField];
    });
    return _objectSpread({
        target: serverLink.wixLinkData["" + proGalleryserverLink.serverLinkField].target || serverLink.target,
        type: 'wix',
        data: _objectSpread(_objectSpread({}, serverLink.wixLinkData["" + proGalleryserverLink.serverLinkField]), {}, {
            type: proGalleryserverLink.type // ...('url' in serverLink && {url: serverLink.url}) -- now we get wixPage direct url add this in future if needed

        })
    }, 'text' in serverLink && {
        text: serverLink.text
    });
};

var buildProGalleryVideo = function buildProGalleryVideo(proGalleryItem, serverItem) {
    var videoData = serverItem.videoMetadata;
    var isExternalVideo = 'source' in videoData && videoData.source !== 'Undefined';
    proGalleryItem = _objectSpread(_objectSpread(_objectSpread({}, proGalleryItem), isExternalVideo && 'posters' in videoData && videoData.posters.length > 0 && {
        mediaUrl: getLastUrlPath(videoData.posters[0].url)
    }), !isExternalVideo && 'mediaUrl' in serverItem && {
        mediaUrl: getWixMediaUrlVideo(serverItem.mediaUrl)
    });
    proGalleryItem.metaData = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, proGalleryItem.metaData), {}, {
        type: 'video'
    }, 'posters' in videoData && {
        customPoster: mapProGalleryVideoPosters(videoData.posters, true).length > 0 ? mapProGalleryVideoPosters(videoData.posters, true)[0] : ''
    }), 'source' in videoData && {
        isExternal: isExternalVideo
    }), 'height' in videoData && {
        height: videoData.height
    }), 'width' in videoData && {
        width: videoData.width
    }), 'name' in serverItem && {
        name: serverItem.name
    }), 'posters' in videoData && {
        posters: mapProGalleryVideoPosters(videoData.posters, false)
    }), 'sourceName' in videoData && {
        isDemo: videoData.sourceName === 'private'
    }), !isExternalVideo && 'resolutions' in videoData && {
        qualities: mapResolutionsToWixVideoQualities(videoData.resolutions)
    }), isExternalVideo && {
        qualities: []
    }), 'duration' in videoData && {
        duration: Number(videoData.duration)
    }), isExternalVideo && {
        source: videoData.source.toLowerCase()
    }), isExternalVideo && {
        videoUrl: serverItem.mediaUrl
    }), isExternalVideo && {
        videoId: videoData.externalId
    }), 'posters' in videoData && 'focalPoint' in videoData.posters[0] && {
        focalPoint: [videoData.posters[0].focalPoint.x, videoData.posters[0].focalPoint.y]
    });
    return proGalleryItem;
};

var photoGalleryQuality = function photoGalleryQuality(photoData) {
    var shouldAddPhotoQuality = 'quality' in photoData || 'unsharpMasking' in photoData;
    return _objectSpread({}, shouldAddPhotoQuality && {
        sharpParams: {
            L: _objectSpread(_objectSpread({}, 'quality' in photoData && {
                overrideQuality: true,
                quality: photoData.quality
            }), 'unsharpMasking' in photoData && {
                overrideUsm: true,
                usm: _objectSpread(_objectSpread(_objectSpread({}, 'amount' in photoData.unsharpMasking && {
                    usm_a: photoData.unsharpMasking.amount
                }), 'radius' in photoData.unsharpMasking && {
                    usm_r: photoData.unsharpMasking.radius
                }), 'threshold' in photoData.unsharpMasking && {
                    usm_t: photoData.unsharpMasking.threshold
                })
            })
        }
    });
};

var buildProGalleryPhoto = function buildProGalleryPhoto(proGalleryItem, serverItem) {
    var haveMediaUrl = 'mediaUrl' in serverItem && createPhotoUrl(serverItem.mediaUrl);
    proGalleryItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, proGalleryItem), haveMediaUrl && {
        mediaUrl: createPhotoUrl(serverItem.mediaUrl)
    }), 'token' in serverItem && {
        token: serverItem.token
    }), 'imageToken' in serverItem && {
        imageToken: serverItem.imageToken
    });
    var photoData = serverItem.photoMetadata;
    proGalleryItem.metaData = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, proGalleryItem.metaData), {}, {
        sourceName: 'private'
    }, 'tags' in serverItem && {
        tags: serverItem.tags
    }), 'sourceName' in photoData && {
        isDemo: photoData.sourceName === 'private'
    }), 'height' in photoData && {
        height: photoData.height
    }), 'width' in photoData && {
        width: photoData.width
    }), 'focalPoint' in photoData && photoData.focalPoint && {
        focalPoint: [photoData.focalPoint.x, photoData.focalPoint.y]
    }), 'name' in serverItem && {
        fileName: serverItem.name
    }), haveMediaUrl && {
        name: createPhotoUrl(serverItem.mediaUrl)
    }), photoGalleryQuality(photoData));
    return proGalleryItem;
};

var buildProGalleryText = function buildProGalleryText(proGalleryItem, serverItem) {
    var textData = serverItem.textMetadata;
    var textDataHaveStyle = ('style' in textData);
    proGalleryItem = _objectSpread(_objectSpread({}, proGalleryItem), {}, {
        mediaUrl: ''
    });
    proGalleryItem.metaData = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, proGalleryItem.metaData), {}, {
        type: 'text'
    }, 'editorHtml' in textData && {
        editorHtml: textData.editorHtml
    }), 'html' in textData && {
        html: textData.html
    }), 'name' in serverItem && {
        name: serverItem.name
    }), 'fontPickerStyleParamName' in textData && {
        fontPickerStyleParamName: textData.fontPickerStyleParamName
    }), textDataHaveStyle && 'height' in textData.style && {
        height: textData.style.height
    }), textDataHaveStyle && 'width' in textData.style && {
        width: textData.style.width
    }), textDataHaveStyle && {
        textStyle: textData.style
    }), 'editorFontId' in textData && {
        fontPickerStyleParamName: textData.editorFontId
    });
    return proGalleryItem;
};

export var serverItemsToProGallery = function serverItemsToProGallery(serverItems) {
    try {
        var proGalleryItems = serverItems.map(function(serverItem) {
            var proGalleryItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, 'id' in serverItem && {
                itemId: serverItem.id
            }), 'secure' in serverItem && {
                isSecure: serverItem.secure
            }), 'orderIndex' in serverItem && {
                orderIndex: serverItem.orderIndex
            }), {}, {
                metaData: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, 'description' in serverItem && {
                    description: serverItem.description
                }), 'title' in serverItem && {
                    title: serverItem.title
                }), {}, {
                    link: {
                        type: 'none',
                        target: '_blank'
                    }
                }, 'link' in serverItem && {
                    link: generateProGalleryLink(serverItem.link)
                }), 'alt' in serverItem && {
                    alt: serverItem.alt
                })
            });

            if (serverItem.dataType === 'Video') {
                return buildProGalleryVideo(proGalleryItem, serverItem);
            } else if (serverItem.dataType === 'Photo') {
                return buildProGalleryPhoto(proGalleryItem, serverItem);
            } else if (serverItem.dataType === 'Text') {
                return buildProGalleryText(proGalleryItem, serverItem);
            }

            return {};
        });
        return proGalleryItems;
    } catch (e) {
        console.error('Wrong format for gallery items', serverItems, e);
        return [];
    }
}; // ------------------------------------------Pro Gallery to Server--------------------------------------------//

var serverLinkToUrl = function serverLinkToUrl() {
    return {
        external: function external(linkData) {
            return linkData.url;
        },
        phone: function phone(linkData) {
            return "tel:" + linkData.phoneNumber;
        },
        email: function email(linkData) {
            return "mailto:" + linkData.recipient + "?subject=" + linkData.subject + "&amp;body=null";
        },
        document: function document(linkData) {
            return "https://docs.wixstatic.com/ugd/" + linkData.docId;
        },
        page: function page(linkData) {
            return '';
        },
        anchor: function anchor(linkData) {
            return '';
        },
        dynamicPage: function dynamicPage(linkData) {
            return '';
        }
    };
};

var generateServerLink = function generateServerLink(proGalleryLink) {
    var _wixLinkData;

    var proGalleryLinkFieldOptions = [{
        type: 'phone',
        proGalleryLinkField: 'PhoneLink',
        isInternal: false
    }, {
        type: 'email',
        proGalleryLinkField: 'EmailLink',
        isInternal: false
    }, {
        type: 'document',
        proGalleryLinkField: 'DocumentLink',
        isInternal: false
    }, {
        type: 'page',
        proGalleryLinkField: 'PageLink',
        isInternal: true
    }, {
        type: 'external',
        proGalleryLinkField: 'ExternalLink',
        isInternal: false
    }, {
        type: 'anchor',
        proGalleryLinkField: 'AnchorLink',
        isInternal: true
    }, {
        type: 'dynamicPage',
        proGalleryLinkField: 'DynamicPageLink',
        isInternal: true
    }];
    var serverPGLink = proGalleryLinkFieldOptions.find(function(_ref2) {
        var proGalleryLinkField = _ref2.proGalleryLinkField;
        return proGalleryLink.data && proGalleryLink.data.type === proGalleryLinkField;
    });

    var _ref3 = proGalleryLink.data || {},
        type = _ref3.type,
        serverLinkData = _objectWithoutPropertiesLoose(_ref3, _excluded);

    return serverPGLink ? {
        link: _objectSpread(_objectSpread(_objectSpread({
            target: proGalleryLink.target
        }, serverLinkData && serverPGLink && {
            wixLinkData: (_wixLinkData = {}, _wixLinkData[serverPGLink.type] = _objectSpread({}, serverLinkData), _wixLinkData)
        }), 'text' in proGalleryLink && {
            text: proGalleryLink.text
        }), {}, {
            type: serverPGLink && serverPGLink.isInternal ? 'Internal' : 'External',
            url: serverLinkToUrl()[serverPGLink.type](serverLinkData)
        })
    } : {};
};

var buildServerPhoto = function buildServerPhoto(_ref4) {
    var proGalleryItem = _ref4.proGalleryItem,
        serverItem = _ref4.serverItem;
    var haveMediaUrl = 'mediaUrl' in proGalleryItem && createServerUrl(proGalleryItem.mediaUrl);
    serverItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem), haveMediaUrl && {
        mediaUrl: createServerUrl(proGalleryItem.mediaUrl)
    }), 'token' in proGalleryItem && {
        token: proGalleryItem.token
    }), 'imageToken' in proGalleryItem && {
        imageToken: proGalleryItem.imageToken
    });
    var metaData = proGalleryItem.metaData;
    serverItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem), {}, {
        dataType: 'Photo',
        photoMetadata: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem.photoMetadata), 'height' in metaData && {
            height: metaData.height
        }), 'width' in metaData && {
            width: metaData.width
        }), 'isDemo' in metaData && {
            sourceName: metaData.isDemo ? 'private' : 'public'
        }), 'focalPoint' in metaData && metaData.focalPoint && {
            focalPoint: {
                x: metaData.focalPoint[0],
                y: metaData.focalPoint[1]
            }
        }), serverQuality(metaData))
    }, 'name' in metaData && {
        name: metaData.fileName
    }), 'tags' in metaData ? {
        tags: metaData.tags
    } : {
        tags: []
    }), haveMediaUrl && {
        mediaUrl: createServerUrl(proGalleryItem.mediaUrl)
    }), metaData.tags.join('').includes('_fileOrigin_uploaded') ? {
        mediaOwner: 'Undefined'
    } : {
        mediaOwner: 'Wix'
    });
    return serverItem;
};

var buildServerText = function buildServerText(_ref5) {
    var proGalleryItem = _ref5.proGalleryItem,
        serverItem = _ref5.serverItem;
    var metaData = proGalleryItem.metaData;
    serverItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem), {}, {
        dataType: 'Text',
        textMetadata: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem.textMetadata), 'editorHtml' in metaData && {
            editorHtml: metaData.editorHtml
        }), 'html' in metaData && {
            html: metaData.html
        }), 'fontPickerStyleParamName' in metaData && {
            editorFontId: metaData.fontPickerStyleParamName
        }), {}, {
            style: _objectSpread(_objectSpread(_objectSpread({}, 'height' in metaData && {
                height: metaData.height
            }), 'width' in metaData && {
                width: metaData.width
            }), 'textStyle' in metaData && _objectSpread({}, metaData.textStyle))
        })
    }, 'name' in metaData && {
        name: metaData.name
    }), 'tags' in metaData ? {
        tags: metaData.tags
    } : {
        tags: []
    }), {}, {
        mediaOwner: 'Undefined'
    });
    return serverItem;
};

var buildServerVideo = function buildServerVideo(_ref6) {
    var _urls;

    var proGalleryItem = _ref6.proGalleryItem,
        serverItem = _ref6.serverItem;
    var metaData = proGalleryItem.metaData;
    var isExternalVideo = metaData.isExternal;
    serverItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem), {}, {
        dataType: 'Video',
        videoMetadata: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, serverItem.videoMetadata), 'height' in metaData && {
            height: metaData.height
        }), 'width' in metaData && {
            width: metaData.width
        }), isExternalVideo && {
            source: capitalizeFirstLetter(metaData.source)
        }), !isExternalVideo && {
            source: 'Undefined'
        }), 'duration' in metaData && {
            duration: String(metaData.duration)
        }), ('posters' in metaData || 'customPoster' in metaData) && {
            posters: createServerPosters(metaData)
        }), 'isDemo' in metaData && {
            sourceName: metaData.isDemo ? 'private' : 'public'
        }), !isExternalVideo && 'qualities' in metaData && metaData.qualities.length > 0 ? {
            resolutions: mapQualitiesToServerResolutions(metaData.qualities, proGalleryItem.mediaUrl)
        } : {
            resolutions: []
        }), isExternalVideo && {
            resolutions: [{
                urls: (_urls = {}, _urls[capitalizeFirstLetter(metaData.source)] = metaData.videoUrl, _urls)
            }]
        }), isExternalVideo && {
            externalId: metaData.videoId
        })
    }, isExternalVideo && {
        mediaUrl: metaData.videoUrl
    }), !isExternalVideo && 'mediaUrl' in proGalleryItem && {
        mediaUrl: Object.values(mapQualitiesToServerResolutions(metaData.qualities, proGalleryItem.mediaUrl).pop().urls)[0]
    }), 'name' in metaData && {
        name: metaData.name
    }), 'tags' in metaData ? {
        tags: metaData.tags
    } : {
        tags: []
    }), isExternalVideo || !metaData.source ? {
        mediaOwner: 'Undefined'
    } : {
        mediaOwner: 'Wix'
    });
    return serverItem;
};

var serverQuality = function serverQuality(metaData) {
    var shouldAddPhotoQuality = 'sharpParams' in metaData && 'L' in metaData.sharpParams && ('unsharpMasking' in metaData.sharpParams.L || 'quality' in metaData.sharpParams.L);

    if (shouldAddPhotoQuality) {
        var L = metaData.sharpParams.L;
        return _objectSpread({}, _objectSpread(_objectSpread({}, 'quality' in L && {
            quality: L.quality
        }), 'usm' in L && {
            unsharpMasking: _objectSpread(_objectSpread(_objectSpread({}, 'usm_a' in L.usm && {
                amount: L.usm.usm_a
            }), 'usm_r' in L.usm && {
                radius: L.usm.usm_r
            }), 'usm_t' in L.usm && {
                threshold: L.usm.usm_t
            })
        }));
    } else {
        return {};
    }
};

var createServerUrl = function createServerUrl(proGalleryUrl) {
    return proGalleryUrl.includes('https://') || proGalleryUrl.includes('http://') ? proGalleryUrl : "https://static.wixstatic.com/media/" + proGalleryUrl;
};

var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var createServerPosters = function createServerPosters(metaData) {
    var posters = [];
    var focalPointObject = metaData && metaData.focalPoint ? {
        focalPoint: {
            x: metaData.focalPoint[0],
            y: metaData.focalPoint[1]
        }
    } : {};
    metaData && metaData.posters.map(function(poster) {
        posters.push(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, 'url' in poster && {
            url: createServerUrl(poster.url)
        }), 'height' in poster && {
            height: poster.height
        }), 'width' in poster && {
            width: poster.width
        }), focalPointObject));
    });

    if (metaData && metaData.customPoster && metaData.customPoster !== '') {
        var customPoster = metaData.customPoster;
        posters.push(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, 'url' in customPoster && {
            url: createServerUrl(customPoster.url)
        }), 'height' in customPoster && {
            height: customPoster.height
        }), 'width' in customPoster && {
            width: customPoster.width
        }), focalPointObject), {}, {
            "default": true
        }));
    }

    return posters;
};

var createResolutionsUrls = function createResolutionsUrls(quality, mediaUrl) {
    var res = {}; // eslint-disable-next-line array-callback-return

    quality.formats.map(function(format) {
        res[format] = "https://video.wixstatic.com/video/" + mediaUrl + "/" + quality.quality + "/" + format + "/file." + format;
    });
    return res;
};

var mapQualitiesToServerResolutions = function mapQualitiesToServerResolutions(qualities, mediaUrl) {
    return qualities.map(function(quality) {
        return {
            height: quality.height,
            width: quality.width,
            videoMode: quality.quality,
            urls: _objectSpread({}, createResolutionsUrls(quality, mediaUrl))
        };
    });
};

export var proGalleryItemsToServer = function proGalleryItemsToServer(proGalleryItems) {
    try {
        var serverItems = proGalleryItems.map(function(proGalleryItem) {
            var metaData = proGalleryItem.metaData;

            var _ref7 = metaData.link && generateServerLink(metaData.link) || {},
                link = _ref7.link;

            var serverItem = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, 'itemId' in proGalleryItem && {
                id: proGalleryItem.itemId
            }), 'isSecure' in proGalleryItem && {
                secure: proGalleryItem.isSecure
            }), 'orderIndex' in proGalleryItem && {
                orderIndex: proGalleryItem.orderIndex
            }), link && {
                link: link
            }), 'description' in metaData && {
                description: metaData.description
            }), 'title' in metaData && {
                title: metaData.title
            }), 'alt' in metaData && {
                alt: metaData.alt
            });

            if (metaData.type === 'video') {
                return buildServerVideo({
                    serverItem: serverItem,
                    proGalleryItem: proGalleryItem
                });
            } else if (metaData.type === 'text') {
                return buildServerText({
                    serverItem: serverItem,
                    proGalleryItem: proGalleryItem
                });
            } else {
                return buildServerPhoto({
                    serverItem: serverItem,
                    proGalleryItem: proGalleryItem
                });
            }
        });
        return serverItems;
    } catch (e) {
        console.error('Wrong format for pro gallery items', proGalleryItems, e);
        return [];
    }
};