import { invert } from './Utils';

export const SCHEDULE_STATUS = invert(ScheduleStatus);
export const UPDATE_STATUS = invert(JobUpdateStatus);
export const UPDATE_ACTION = invert(JobUpdateAction);

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

export const OKAY_UPDATE_STATUS = [
  JobUpdateStatus.ROLLED_FORWARD
];

export const WARNING_UPDATE_STATUS = [
  JobUpdateStatus.ROLL_FORWARD_AWAITING_PULSE,
  JobUpdateStatus.ROLL_FORWARD_PAUSED
];

export const ERROR_UPDATE_STATUS = [
  JobUpdateStatus.ROLLING_BACK,
  JobUpdateStatus.ROLLED_BACK,
  JobUpdateStatus.ROLL_BACK_PAUSED,
  JobUpdateStatus.ABORTED,
  JobUpdateStatus.ERROR,
  JobUpdateStatus.FAILED,
  JobUpdateStatus.ROLL_BACK_AWAITING_PULSE
];

export default {
  OKAY_SCHEDULE_STATUS,
  WARNING_SCHEDULE_STATUS,
  ERROR_SCHEDULE_STATUS,
  OKAY_UPDATE_STATUS,
  WARNING_UPDATE_STATUS,
  ERROR_UPDATE_STATUS
};
