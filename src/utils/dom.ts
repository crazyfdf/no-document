export function getOuterWidth(el: HTMLElement, margin = false) {
  if (el) {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  } else {
    return 0;
  }
}
export type useClipboardResult = {
  copyText: (text: string) => void;
};
