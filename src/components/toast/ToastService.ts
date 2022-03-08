import { ToastOptions } from './index';
import { EventBus } from 'primevue/utils';
import { App } from 'vue';
import { YToastSymbol } from './UseToast';

export const ToastEventBus = EventBus();

export default {
  install: (app: App) => {
    const ToastService = {
      add: (message: ToastOptions) => {
        ToastEventBus.emit('add', message);
      },
      remove: (id: number | string | symbol) => {
        ToastEventBus.emit('remove', id);
      },
    };
    app.config.globalProperties.$toast = ToastService;
    app.provide(YToastSymbol, ToastService);
  },
};
