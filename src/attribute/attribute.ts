import { Attributes } from './models';

const attributesMap: Record<string, string> = {
  'className': 'class',
};

export function transferAttr(attr: string) {
  return attributesMap[attr] || attr;
}

export function setAttributes(ele: HTMLElement, attributes?: Attributes) {
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      ele.setAttribute(transferAttr(key), attributes[key]);
    });
  }
}
