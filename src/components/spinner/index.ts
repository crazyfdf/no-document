import { withInstall } from '@/utils/with-install';
import _Spinner from './index.vue';

const Spinner = withInstall<typeof _Spinner>({
  ..._Spinner,
  componentName: 'YSpinner',
});

export { Spinner };
export default Spinner;
