import { inject } from 'vue';
import { ToastOptions } from './index';

export const YToastSymbol = Symbol();
export interface ToastServiceMethods {
  /**
   * Displays the message in a suitable Toast component.
   * @param {ToastOptions} message - Message instance.
   */
  add: (message: ToastOptions) => void;
  /**
   * Clears the messages that belongs to the group.
   * @param {number|string|symbol} group - Name of the message group.
   */
  remove: (id: number | string | symbol) => void;
}
export function useToast(): ToastServiceMethods {
  const YToast: ToastServiceMethods | undefined = inject(YToastSymbol);
  if (!YToast) {
    throw new Error('No Toast provided!');
  }

  return YToast;
}
