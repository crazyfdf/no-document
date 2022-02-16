import { get, isNil } from 'lodash';
import enUS from './en-US';
import zhCN from './zh-CN';
import { usePrimeVue } from 'primevue/config';

export const langPacks = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

export default langPacks;

export function useChangeLocale() {
  const $primevue = usePrimeVue();
  return function(newLocale: string) {
    const newLangPack = get(langPacks, newLocale);
    if (isNil(newLangPack)) {
      throw Error(`locale ${newLocale} not supported`);
    }
    if (!isNil(newLangPack?.primevue)) {
      $primevue.config.locale = newLangPack.primevue;
    }
  };
}
