package com.twitter.mesos.scheduler;

import java.util.Collection;
import java.util.Set;
import java.util.logging.Logger;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import com.google.common.base.Supplier;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Iterables;

import com.twitter.mesos.gen.Attribute;
import com.twitter.mesos.gen.Constraint;
import com.twitter.mesos.gen.ScheduledTask;
import com.twitter.mesos.gen.TaskConstraint;
import com.twitter.mesos.scheduler.SchedulingFilter.Veto;
import com.twitter.mesos.scheduler.SchedulingFilterImpl.AttributeLoader;
import com.twitter.mesos.scheduler.configuration.ConfigurationManager;

import static com.google.common.base.Preconditions.checkNotNull;

import static com.twitter.common.base.MorePreconditions.checkNotBlank;

/**
 * Filter that determines whether a task's constraints are satisfied.
 *
 * @author William Farner
 */
class ConstraintFilter implements Function<Constraint, Optional<Veto>> {

  private static final Logger LOG = Logger.getLogger(ConstraintFilter.class.getName());

  private final String jobKey;
  private final Supplier<Collection<ScheduledTask>> activeTasksSupplier;
  private final AttributeLoader attributeLoader;
  private final Iterable<Attribute> hostAttributes;

  /**
   * Creates a new constraint filer for a given job.
   *
   * @param jobKey Key for the job.
   * @param activeTasksSupplier Supplier to fetch active tasks (if necessary).
   * @param attributeLoader Interface to fetch host attributes (if necessary).
   * @param hostAttributes The attributes of the host to test against.
   */
  ConstraintFilter(
      String jobKey,
      Supplier<Collection<ScheduledTask>> activeTasksSupplier,
      AttributeLoader attributeLoader,
      Iterable<Attribute> hostAttributes) {

    this.jobKey = checkNotBlank(jobKey);
    this.activeTasksSupplier = checkNotNull(activeTasksSupplier);
    this.attributeLoader = checkNotNull(attributeLoader);
    this.hostAttributes = checkNotNull(hostAttributes);
  }

  @VisibleForTesting
  static Veto constraintVeto(String constraint) {
    if (constraint.equals(ConfigurationManager.DEDICATED_ATTRIBUTE)) {
      return Veto.dedicated("Task is dedicated.");
    } else {
      return new Veto("Constraint not satisfied: " + constraint, Veto.MAX_SCORE);
    }
  }

  @VisibleForTesting
  static Veto missingLimitVeto(String constraint) {
    return new Veto("Limit constraint not present: " + constraint, Veto.MAX_SCORE);
  }

  @Override
  public Optional<Veto> apply(Constraint constraint) {
    Set<Attribute> attributes =
        ImmutableSet.copyOf(Iterables.filter(hostAttributes, new NameFilter(constraint.getName())));

    TaskConstraint taskConstraint = constraint.getConstraint();
    switch (taskConstraint.getSetField()) {
      case VALUE:
        boolean matches =
            AttributeFilter.matches(attributes, taskConstraint.getValue());
        return matches
            ? Optional.<Veto>absent()
            : Optional.of(constraintVeto(constraint.getName()));

      case LIMIT:
        if (attributes.isEmpty()) {
          return Optional.of(missingLimitVeto(constraint.getName()));
        }

        boolean satisfied = AttributeFilter.matches(
            attributes,
            jobKey,
            taskConstraint.getLimit().getLimit(),
            activeTasksSupplier.get(),
            attributeLoader);
        return satisfied
            ? Optional.<Veto>absent()
            : Optional.of(constraintVeto(constraint.getName()));

      default:
        LOG.warning("Unrecognized constraint type: " + taskConstraint.getSetField());
        throw new SchedulerException("Failed to recognize the constraint type: "
            + taskConstraint.getSetField());
    }
  }

  /**
   * A filter to find attributes matching a name.
   */
  static class NameFilter implements Predicate<Attribute> {
    private final String attributeName;

    NameFilter(String attributeName) {
      this.attributeName = attributeName;
    }

    @Override public boolean apply(Attribute attribute) {
      return attributeName.equals(attribute.getName());
    }
  }
}
