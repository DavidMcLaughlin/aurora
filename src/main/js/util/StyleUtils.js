import Thrift from './ThriftUtils';

export const getClassForScheduleStatus = (status) => {
  if (Thrift.OKAY_SCHEDULE_STATUS.includes(status)) {
    return 'okay';
  } else if (Thrift.WARNING_SCHEDULE_STATUS.includes(status)) {
    return 'attention';
  } else if (Thrift.ERROR_SCHEDULE_STATUS.includes(status)) {
    return 'error';
  }
  return 'system';
}
