/**
 * Things to do before installing components
 */
import type { App } from 'vue';
import { get } from 'lodash';
import PrimeVue from 'primevue/config';
import localePacks from '../locale';

export interface InstallOptions {
  locale: string
};

export default function (app: App, options?: InstallOptions) {
  app.use(PrimeVue, { locale: get(localePacks, options?.locale ?? 'zh-CN')?.primevue });
}
