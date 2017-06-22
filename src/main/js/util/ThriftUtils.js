import { invert } from './Utils';

export const SCHEDULE_STATUS = invert(ScheduleStatus);
export const UPDATE_STATUS = invert(JobUpdateStatus);

export const OKAY_SCHEDULE_STATUS = [
  ScheduleStatus.RUNNING,
  ScheduleStatus.FINISHED
];

export const WARNING_SCHEDULE_STATUS = [
  ScheduleStatus.PENDING,
  ScheduleStatus.ASSIGNED,
  ScheduleStatus.STARTING,
  ScheduleStatus.LOST,
  ScheduleStatus.KILLING,
  ScheduleStatus.DRAINING,
  ScheduleStatus.PREEMPTING
];

export const ERROR_SCHEDULE_STATUS = [
  ScheduleStatus.THROTTLED,
  ScheduleStatus.FAILED
];

export default {
  OKAY_SCHEDULE_STATUS,
  WARNING_SCHEDULE_STATUS,
  ERROR_SCHEDULE_STATUS
};
