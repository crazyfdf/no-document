import type { Component, App as VueApp } from 'vue';
import { ComponentWithInstall } from '@/utils/with-install';
import PrimeToastService from './ToastService';
import { useToast as _useToast } from './UseToast';
import _Toast from './index.vue';
import { Severity } from '@/vue/icon';
export type ToastPosition = 'top' | 'right';

export class ToastOptions {
  id?: number | string | symbol;
  severity?: Severity;
  position?: ToastPosition;
  title?: string;
  detail?: string;
  closable?: boolean;
  group?: string;
  life?: number;
  pending?: boolean;
}

export interface ToastService {
  add: (options: ToastOptions) => void;
  remove: (id: number | string | symbol) => void;
}

export function useToast(): ToastService {
  const toast = _useToast();
  return {
    add({
      id,
      severity,
      position: _position,
      title,
      detail,
      closable,
      life,
      pending,
    }: ToastOptions) {
      const position = _position ?? 'top';
      life = life || (position === 'top' ? 3000 : 4500);
      toast.add({
        id,
        severity: severity ?? 'info',
        group: position,
        title,
        detail,
        closable,
        life,
        pending,
      });
    },
    remove(id) {
      toast.remove(id);
    },
  };
}

const Toast: ComponentWithInstall<typeof _Toast | Component> = {
  ..._Toast,
  install(app: VueApp) {
    app.use(PrimeToastService);
    app.component('YToast', this);
  },
};

export default Toast;
export { Toast };
