import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { Ship } from './ship';
import type { Reward } from './reward';
import type { Resource } from './resource';

export interface EventStats {
  rewards: {
    [key: string]: {
      total: number;
      ships: number;
    };
  };
  conversions: {
    [key: string]: {
      container: any;
      source: Resource;
      total: number;
    };
  };
  totalRequiredXP: number;
}

export interface RewardCalculatorEvent {
  calculateShipReward(ship: Ship): Reward | undefined;
  possibleResources: Resource[];
}

/**
 * Creates a derived store that calculates rewards for a list of ships
 */
export function createRewardsStore(
  shipsStore: Readable<Promise<Ship[]>>,
  event: RewardCalculatorEvent
): Readable<Promise<(Reward & { ship: Ship })[]>> {
  return derived(shipsStore, async ($ships) => {
    return (await $ships)
      .map((ship: Ship) => {
        const reward = event.calculateShipReward(ship);
        return reward ? { ...reward, ship } : null;
      })
      .filter(
        (reward: (Reward & { ship: Ship }) | null): reward is Reward & { ship: Ship } =>
          reward !== null && reward.amount > 0
      )
      .sort((a: { ship: Ship }, b: { ship: Ship }) => {
        if (a.ship.tier === b.ship.tier) {
          const nameA = a.ship.name || '';
          const nameB = b.ship.name || '';
          return nameA.localeCompare(nameB);
        }

        return b.ship.tier - a.ship.tier;
      });
  });
}

/**
 * Creates a derived store that calculates event statistics from rewards
 */
export function createEventStatsStore(
  rewardsStore: Readable<Promise<(Reward & { ship: Ship })[]>>,
  event: RewardCalculatorEvent
): Readable<Promise<EventStats>> {
  return derived(rewardsStore, async ($rewards) => {
    const res = (await $rewards).reduce(
      (acc: EventStats, reward: Reward & { ship: Ship }) => {
        return {
          rewards: {
            ...acc.rewards,
            [reward.resource.name]: {
              total: acc.rewards[reward.resource.name].total + reward.amount,
              ships: acc.rewards[reward.resource.name].ships + 1
            }
          },
          conversions: acc.conversions,
          totalRequiredXP: acc.totalRequiredXP + reward.requiredXP
        };
      },
      {
        rewards: event.possibleResources.reduce(
          (acc, resource) => ({ ...acc, [resource.name]: { total: 0, ships: 0 } }),
          {} as EventStats['rewards']
        ),
        conversions: {} as EventStats['conversions'],
        totalRequiredXP: 0
      }
    );

    // calculate container conversions
    const conversions: EventStats['conversions'] = {};

    for (const resourceName of Object.keys(res.rewards)) {
      const total = res.rewards[resourceName]?.total || 0;
      const resource = event.possibleResources.find((r) => r.name === resourceName);
      if (!resource) {
        continue;
      }

      for (const conversion of resource.convertsTo || []) {
        const maxAmount = Math.floor(total / conversion.cost);
        const containerName = conversion.container.name;

        if (conversions[containerName]) {
          conversions[containerName].total += maxAmount * conversion.returns;
          conversions[containerName].container = conversion.container;
        } else {
          conversions[containerName] = {
            total: maxAmount * conversion.returns,
            container: conversion.container,
            source: resource
          };
        }
      }
    }

    res.conversions = Object.keys(conversions).reduce(
      (acc, key) => {
        const conversion = conversions[key];
        if (conversion && conversion.total > 0) {
          return { ...acc, [key]: conversion };
        }

        return acc;
      },
      {} as EventStats['conversions']
    );

    return res;
  });
}
