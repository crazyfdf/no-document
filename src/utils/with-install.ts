import { App } from 'vue';

export type ComponentWithInstall<T = { name?: string }> = T & {
  install(app: App): void;
};

export function withInstall<T>(options: any): ComponentWithInstall<T> {
  (options as ComponentWithInstall<T>).install = (app: App) => {
    const { componentName } = options;
    app.component(componentName, options);
  };

  return options;
}
