export var createUniqueUuidFromString = function createUniqueUuidFromString(str) {
    function hashToInt(currStr) {
        var hash = 0;

        if (typeof currStr === 'undefined' || currStr.length === 0) {
            return hash;
        }

        for (var i = 0; i < currStr.length; i++) {
            var chr = currStr.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }

        hash *= Math.sign(hash);
        hash = Math.sqrt(hash);
        hash = Math.floor((hash - Math.floor(hash)) * 1000000);
        return hash;
    }

    var num = hashToInt(str);
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c, i) {
        var r = Math.ceil(num / (i + 1)) % 16,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    }); // console.log('Generated uuid & number from string', num, uuid, str);

    return uuid;
};
export var slugify = function slugify(text) {
    if (text === void 0) {
        text = '';
    }

    return !text ? '' : text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-\.]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};