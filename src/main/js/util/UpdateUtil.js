import { UPDATE_ACTION } from 'util/ThriftUtils';
import { sort } from 'util/Utils';

export const isSuccessfulUpdate = (update) => {
  return update.update.summary.state.status === JobUpdateStatus.ROLLED_FORWARD;
};

export const isInProgressUpdate = (update) => {
  return update.update.summary.state.status === JobUpdateStatus.ROLLING_FORWARD;
};

const processInstanceIdsFromRanges = (ranges, fn) => {
  ranges.forEach((r) => {
    for (let i = r.first; i <= r.last; i++) {
      fn(i);
    }
  });
};

const getAllInstanceIds = (update) => {
  const allIds = {};
  const newIds = {};
  const oldIds = {};

  processInstanceIdsFromRanges(update.instructions.desiredState.instances, (id) => {
    newIds[id] = true;
    allIds[id] = true;
  });

  update.instructions.initialState.forEach((task) => {
    processInstanceIdsFromRanges(task.instances, (id) => {
      oldIds[id] = true;
      allIds[id] = true;
    });
  })
  return { allIds, newIds, oldIds };
};

const getLatestInstanceEvents = (instanceEvents, predicate = (e) => true) => {
  const events = sort(instanceEvents, (e) => e.timestampMs, true);
  const instanceMap = {};
  events.forEach((e) => {
    if (!instanceMap.hasOwnProperty(e.instanceId) && predicate(e)) {
      instanceMap[e.instanceId] = e;
    }
  });
  return instanceMap;
};

const classForUpdateAction = (action) => {
  return UPDATE_ACTION[action].toLowerCase().replace(/_/g, '-');
}

export const instanceSummary = (details) => {
  const instances = getAllInstanceIds(details.update);
  const latestInstanceEvents = getLatestInstanceEvents(details.instanceEvents);
  const allIds = Object.keys(instances.allIds);

  return allIds.map((i) => {
    // If there is an event, use the event to generate the instance status.
    if (latestInstanceEvents.hasOwnProperty(i)) {
      const latestEvent = latestInstanceEvents[i];
      // If instance has been updated and is in initial state, but not in desired state,
      // then it's a removed instance.
      if (latestEvent.action === JobUpdateAction.INSTANCE_UPDATED &&
          instances.oldIds.hasOwnProperty(i) &&
          !instances.newIds.hasOwnProperty(i))  {
        return {
          instanceId: i,
          className: 'instance-removed'
        };
      }

      // Normal case - the latest action is the current status
      return {
        instanceId: i,
        className: classForUpdateAction(latestEvent.action)
      };
    } else {
      // No event, so it's a pending instance.
      return {
        instanceId: i,
        className: 'pending'
      }
    }
  });
}

const progressFromEvents = (instanceEvents) => {
  const success = getLatestInstanceEvents(instanceEvents,
    (e) => e.action === JobUpdateAction.INSTANCE_UPDATED);
  return Object.keys(success).length;
};

export const updateStats = (details) => {
  const allInstances = Object.keys(getAllInstanceIds(details.update).allIds);
  const totalInstancesToBeUpdated = allInstances.length;
  const instancesUpdated = progressFromEvents(details.instanceEvents);
  const progress = Math.round((instancesUpdated / totalInstancesToBeUpdated) * 100);
  return {
    totalInstancesToBeUpdated,
    instancesUpdated,
    progress
  };
};

