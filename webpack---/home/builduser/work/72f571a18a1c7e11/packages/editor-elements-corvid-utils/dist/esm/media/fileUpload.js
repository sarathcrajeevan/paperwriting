var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var baseAcceptableFilesTypes = {
    /* eslint-disable prettier/prettier */
    Image: '.bmp,.gif,.heic,.heif,.jfi,.jfif,.jpe,.jpeg,.jpg,.png,.tif,.tiff,.webp',
    Document: '.ai,.cdr,.csv,.doc,.docb,.docx,.dot,.dotx,.dwg,.eps,.epub,.fla,.gpx,.ical,.icalendar,.ics,.ifb,.indd,.ipynb,.key,.kml,.kmz,.mobi,.mtf,.mtx,.numbers,.odg,.odp,.ods,.odt,.otp,.ots,.ott,.oxps,.pages,.pdf,.pdn,.pkg,.pot,.potx,.pps,.ppsx,.ppt,.pptx,.psd,.pub,.rtf,.sldx,.txt,.vcf,.xcf,.xls,.xlsx,.xlt,.xltx,.xlw,.xps',
    Video: '.3gp,.avi,.divx,.flv,.m1v,.m2ts,.m4v,.mkv,.mov,.mp4,.mpe,.mpeg,.mpg,.mxf,.ogv,.vob,.webm,.wmv,.xvid',
    Audio: '.aac,.aif,.aiff,.flac,.m4a,.mp3,.wav,.wma',
    /* eslint-enable prettier/prettier */
};
export var acceptableFilesTypes = __assign(__assign({}, baseAcceptableFilesTypes), {
    Gallery: baseAcceptableFilesTypes.Image + "," + baseAcceptableFilesTypes.Video
});
export var facebookAcceptableFileTypes = {
    iOS: {
        Image: 'image/*',
        Document: undefined,
        Video: 'video/*',
        Audio: undefined,
        Gallery: 'image/*,video/*',
    },
    other: {
        Image: 'image/*',
        Document: undefined,
        Video: 'video/*',
        Audio: 'audio/*',
        Gallery: 'image/*,video/*',
    },
};
export var fileTypeMatchers = {
    Image: /\.(bmp|gif|hei[cf]|jfif?|jpeg?|jpg|png|tiff?|webp)$/i,
    Document: /\.(ai|cdr|csv|doc[xb]?|dotx?|dwg|eps|e?pub|fla|gpx|ical(endar)?|ics|indd|ipynb|key|km[lz]|mobi|mt[fx]|numbers|od[gpst]|ot[pst]|oxps|pages|pd[fn]|pkg|potx?|pp[st]x?|psd|rtf|sldx|txt|vcf|xcf|xl[st]x?|xlw|xps)$/i,
    Video: /\.(3gp|avi|divx|flv|m1v|m2ts|m4v|mkv|mov|mp4|mpeg?|mpg|mxf|ogv|vob|webm|wmv|xvid)$/i,
    Audio: /\.(aac|aiff?|flac|m4a|mp3|wav|wma)$/i,
};
export var fileTypeToBaseFileType = function(fileType, fileName) {
    return fileType === 'Gallery' ?
        fileTypeMatchers.Image.test(fileName) ?
        'Image' :
        'Video' :
        fileType;
};
export var fileTypeToMediaType = function(fileType, fileName) {
    var mediaTypesTranslation = {
        Image: 'picture',
        Document: 'document',
        Video: 'video',
        Audio: 'music',
    };
    return mediaTypesTranslation[fileTypeToBaseFileType(fileType, fileName)];
};
export var getFileDataByType = function(fileType, uploadedFileData) {
    var _a, _b;
    var baseFileType = fileTypeToBaseFileType(fileType, uploadedFileData.file_name);
    switch (baseFileType) {
        case 'Image':
            return __assign(__assign({}, uploadedFileData), {
                uri: uploadedFileData.file_name,
                filename: uploadedFileData.original_file_name
            });
        case 'Document':
            return __assign(__assign({}, uploadedFileData), {
                uri: uploadedFileData.file_name,
                filename: uploadedFileData.original_file_name
            });
        case 'Video':
            var posterImages = ((_a = uploadedFileData.file_output) === null || _a === void 0 ? void 0 : _a.image) || [];
            var poster01 = posterImages[1] || {
                url: ''
            };
            return __assign(__assign({}, uploadedFileData), {
                uri: uploadedFileData.file_name,
                filename: uploadedFileData.original_file_name,
                posterUri: poster01.url.replace('media/', ''),
                width: poster01.width,
                height: poster01.height
            });
        case 'Audio':
            return __assign(__assign({}, uploadedFileData), {
                uri: uploadedFileData.file_name,
                filename: uploadedFileData.original_file_name,
                duration: ((_b = uploadedFileData.file_input) === null || _b === void 0 ? void 0 : _b.duration) || 0
            });
        default:
            return uploadedFileData;
    }
};
export var mediaTypeToMediaSrcType = {
    picture: 'image',
    document: 'document',
    video: 'video',
    music: 'audio',
};
//# sourceMappingURL=fileUpload.js.map