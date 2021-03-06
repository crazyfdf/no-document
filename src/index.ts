
/*
 * READ-ONLY!
 * THIS FILE IS GENERATED BY BUILD PROCESS
 * READ-ONLY!
 */

import '@/style.css';
import type { App, ComponentOptions } from 'vue';
import preInstall, { InstallOptions } from './hooks/pre-install';
import { ComponentWithInstall } from './utils/with-install';
import Button from './components/button';
import Loading from './components/loading';
import Spinner from './components/spinner';
import Toast from './components/toast';
import TreeTable from './components/tree-table';
import TreeTableColumn from './components/tree-table-column';
const version = '3.2.0';

/**
 * Components that are currently just PrimeVue components 
 */


import pBadge from 'primevue/badge';
export const Badge: ComponentOptions = {
  ...pBadge,
  name: 'YBadge',
};
    

import pBlockui from 'primevue/blockui';
export const BlockUi: ComponentOptions = {
  ...pBlockui,
  name: 'YBlockUi',
};
    

import pBreadcrumb from 'primevue/breadcrumb';
export const Breadcrumb: ComponentOptions = {
  ...pBreadcrumb,
  name: 'YBreadcrumb',
};
    

import pCascadeselect from 'primevue/cascadeselect';
export const CascadeSelect: ComponentOptions = {
  ...pCascadeselect,
  name: 'YCascadeSelect',
};
    

import pDatatable from 'primevue/datatable';
export const DataTable: ComponentOptions = {
  ...pDatatable,
  name: 'YDataTable',
};
    

import pColumn from 'primevue/column';
export const DataTableColumn: ComponentOptions = {
  ...pColumn,
  name: 'YDataTableColumn',
};
    

import pColumngroup from 'primevue/columngroup';
export const DataTableColumnGroup: ComponentOptions = {
  ...pColumngroup,
  name: 'YDataTableColumnGroup',
};
    

import pContextmenu from 'primevue/contextmenu';
export const ContextMenu: ComponentOptions = {
  ...pContextmenu,
  name: 'YContextMenu',
};
    

import pCheckbox from 'primevue/checkbox';
export const Checkbox: ComponentOptions = {
  ...pCheckbox,
  name: 'YCheckbox',
};
    

import pDialog from 'primevue/dialog';
export const Dialog: ComponentOptions = {
  ...pDialog,
  name: 'YDialog',
};
    

import pDropdown from 'primevue/dropdown';
export const Select: ComponentOptions = {
  ...pDropdown,
  name: 'YSelect',
};
    

import pFileupload from 'primevue/fileupload';
export const Upload: ComponentOptions = {
  ...pFileupload,
  name: 'YUpload',
};
    

import pInputtext from 'primevue/inputtext';
export const InputText: ComponentOptions = {
  ...pInputtext,
  name: 'YInputText',
};
    

import pInputswitch from 'primevue/inputswitch';
export const InputSwitch: ComponentOptions = {
  ...pInputswitch,
  name: 'YInputSwitch',
};
    

import pPassword from 'primevue/password';
export const Password: ComponentOptions = {
  ...pPassword,
  name: 'YPassword',
};
    

import pMultiselect from 'primevue/multiselect';
export const MultiSelect: ComponentOptions = {
  ...pMultiselect,
  name: 'YMultiSelect',
};
    

import pMessage from 'primevue/message';
export const Message: ComponentOptions = {
  ...pMessage,
  name: 'YMessage',
};
    

import pRadiobutton from 'primevue/radiobutton';
export const RadioButton: ComponentOptions = {
  ...pRadiobutton,
  name: 'YRadioButton',
};
    

import pSplitbutton from 'primevue/splitbutton';
export const SplitButton: ComponentOptions = {
  ...pSplitbutton,
  name: 'YSplitButton',
};
    

import pSidebar from 'primevue/sidebar';
export const Sidebar: ComponentOptions = {
  ...pSidebar,
  name: 'YSidebar',
};
    

import pSkeleton from 'primevue/skeleton';
export const Skeleton: ComponentOptions = {
  ...pSkeleton,
  name: 'YSkeleton',
};
    

import pSteps from 'primevue/steps';
export const Steps: ComponentOptions = {
  ...pSteps,
  name: 'YSteps',
};
    

import pSelectbutton from 'primevue/selectbutton';
export const SelectButton: ComponentOptions = {
  ...pSelectbutton,
  name: 'YSelectButton',
};
    

import pTabview from 'primevue/tabview';
export const TabView: ComponentOptions = {
  ...pTabview,
  name: 'YTabView',
};
    

import pTabpanel from 'primevue/tabpanel';
export const TabPanel: ComponentOptions = {
  ...pTabpanel,
  name: 'YTabPanel',
};
    

import pTag from 'primevue/tag';
export const Tag: ComponentOptions = {
  ...pTag,
  name: 'YTag',
};
    

import pTextarea from 'primevue/textarea';
export const Textarea: ComponentOptions = {
  ...pTextarea,
  name: 'YTextarea',
};
    

import pTogglebutton from 'primevue/togglebutton';
export const ToggleButton: ComponentOptions = {
  ...pTogglebutton,
  name: 'YToggleButton',
};
    

import pRow from 'primevue/row';
export const DataTableRow: ComponentOptions = {
  ...pRow,
  name: 'YDataTableRow',
};
    

import pOverlaypanel from 'primevue/overlaypanel';
export const OverlayPanel: ComponentOptions = {
  ...pOverlaypanel,
  name: 'YOverlayPanel',
};
    

import pPanelmenu from 'primevue/panelmenu';
export const PanelMenu: ComponentOptions = {
  ...pPanelmenu,
  name: 'YPanelMenu',
};
    

/**
 * PrimeVue Components END
 */


function install(app: App, options: InstallOptions) {
  preInstall(app, options);
  const components: Array<ComponentOptions | ComponentWithInstall> = [
    Button,
    Loading,
    Spinner,
    Toast,
    TreeTable,
    TreeTableColumn,
    Badge,
    BlockUi,
    Breadcrumb,
    CascadeSelect,
    DataTable,
    DataTableColumn,
    DataTableColumnGroup,
    ContextMenu,
    Checkbox,
    Dialog,
    Select,
    Upload,
    InputText,
    InputSwitch,
    Password,
    MultiSelect,
    Message,
    RadioButton,
    SplitButton,
    Sidebar,
    Skeleton,
    Steps,
    SelectButton,
    TabView,
    TabPanel,
    Tag,
    Textarea,
    ToggleButton,
    DataTableRow,
    OverlayPanel,
    PanelMenu,
  ];

  components.forEach(item => {
    if (typeof item.install !== 'undefined') {
      app.use(item as ComponentWithInstall);
    } else if (item.name) {
      app.component(item.name, item);
    }
  });
}

export * from './components/button';
export * from './components/loading';
export * from './components/spinner';
export * from './components/toast';
export * from './components/tree-table';
export * from './components/tree-table-column';

export * from './locale';
export {
  install,
  version,
};
export default {
  install,
  version
};