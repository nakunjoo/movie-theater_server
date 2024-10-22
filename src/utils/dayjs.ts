import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.locale('ko');

dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Seoul');
dayjs.tz.setDefault('UTC');

export default dayjs;
