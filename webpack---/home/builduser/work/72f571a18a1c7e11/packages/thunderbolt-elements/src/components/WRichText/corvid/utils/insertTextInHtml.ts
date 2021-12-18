import parser from '@wix/neat-html-parser';

function buildHtmlFromTagStack(tagStack: Array<any>, textInTheMiddle: string) {
  let openTags = '';
  let closingTags = '';

  for (const { tagName, props } of tagStack) {
    openTags += props ? `<${tagName} ${props}>` : `<${tagName}>`;
    closingTags = `</${tagName}>${closingTags}`;
  }

  return openTags + textInTheMiddle + closingTags;
}

export function insertTextInHtml(html: string, text: string) {
  const tagStack: Array<any> = [];

  let stop = false;

  parser.parseFragment(html, {
    onText: () => {
      stop = true;
    },
    onOpenTag: (tag: any) => {
      if (tag.tagName === 'span' && tag.props === 'class="wixGuard"') {
        stop = true;
      }
      if (!stop) {
        tagStack.push(tag);
      }
    },
    onClosingTag: () => {
      if (!stop) {
        // if we are here than tag is empty
        tagStack.pop();
      }
    },
  });

  return buildHtmlFromTagStack(tagStack, text);
}
