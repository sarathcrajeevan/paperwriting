const styleMap: Record<string, any> = {
  p: 'font_8',
  h1: 'font_0',
  h2: 'font_2',
  h3: 'font_3',
  h4: 'font_4',
  h5: 'font_5',
  h6: 'font_6',
  ol: 'font_8',
  ul: 'font_8',
};

const startBlockRegexp = /<(ol|ul|h[1-6]|p)(.*?)>/g;
const p1p2regexp = /(class\s*=['"][^'"]*?)\bfont_([79])\b/;

export function applyTransformationForGetHtml(data = '') {
  return data.replace(startBlockRegexp, (match, tag, attributes = '') => {
    const defaultClass = styleMap[tag];

    const defaultClassForTagRegexp = new RegExp(
      `(class\\s*=['"].*?)${defaultClass}`,
    );
    if (defaultClassForTagRegexp.test(attributes)) {
      match = match.replace(defaultClassForTagRegexp, '$1');
    } else if (tag === 'p' && p1p2regexp.test(attributes)) {
      match = match.replace(
        p1p2regexp,
        (matcho, prefix, p1p2) => `${prefix}${p1p2 === '7' ? 'p1' : 'p3'}`,
      );
    }
    return match
      .replace(/class\s*=(['"])\s*\1/, '') // remove empty class attribute
      .replace(
        /class\s*=(['"])\s*(.*?)\s*\1/,
        (_match, quote, classes) => `class=${quote}${classes}${quote}`,
      )
      .replace(/(.+)\s{2,}/g, '$1 ') // remove pointless additional spaces e.g:class="a      b"
      .replace(/\s+>/, '>'); // remove pointless space from before closing tag
  });
}

const regexp = /<(ol|ul|h[1-6]|p)(.*?)>/g;
const classRegexp = /class\s*?=\s*["'](.*?)['"]/;
const g2ClassRegexp = /(class\s*?=\s*["'])(.*?)(['"])/;

export const applyTransformationForSetHtml = (htmlString = '') => {
  if (!htmlString) {
    return htmlString;
  }
  return htmlString.replace(regexp, (match, g1, g2) => {
    const matchedClassArray = g2.match(classRegexp);

    if (!matchedClassArray) {
      return `<${g1}${g2} class="${styleMap[g1]}">`;
    }

    const matchedClass = matchedClassArray[1];

    if (/(^|\s)font_[0-9]($|\s)/.test(matchedClass)) {
      return match;
    } else if (g1 === 'p' && /\bp[13]\b/i.test(matchedClass)) {
      return match.replace(
        /(.*?\bclass\s*?=.*?)\bp([13])\b(.*)/,
        (matcho, _g1, _g2, g3) => {
          const _class = _g2 === '1' ? 'font_7' : 'font_9';
          return `${_g1}${_class}${g3}`;
        },
      );
    }

    return `<${g1}${g2.replace(
      g2ClassRegexp,
      (_match: any, _g1: any, _g2: any, _g3: any) =>
        `${_g1}${styleMap[g1]} ${_g2}${_g3}`,
    )}>`;
  });
};
