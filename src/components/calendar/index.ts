import { withInstall } from '@/utils/with-install';
import _Calendar from './index.vue';

const Calendar = withInstall<typeof _Calendar>({
  ..._Calendar,
  componentName: 'YCalendar',
});

export { Calendar };
export default Calendar;
