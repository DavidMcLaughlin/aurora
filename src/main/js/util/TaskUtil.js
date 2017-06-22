export function isActive(task) {
  return ACTIVE_STATES.includes(task.status);
}
