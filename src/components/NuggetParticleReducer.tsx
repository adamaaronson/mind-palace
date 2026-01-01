import {
  DEFAULT_FOUNT_WIDTH,
  MAX_NUGGETS_AT_ONCE,
  NUGGET_PARTICLE_DURATION_MS,
  REFRESH_TIME,
} from "../utils/constants";
import type { NuggetParticleProps } from "./NuggetParticle";

export type NuggetParticleState = {
  previousNuggetTimestamp: number;
  nuggetParticles: NuggetParticleProps[];
};

export type NuggetParticleAction =
  | {
      type: "automatic";
      nuggetCount: number;
      nuggetsPerSecond: number;
    }
  | {
      type: "manual";
      nuggetCount: number;
    };

export function createNuggetParticles(
  nuggetCount: number,
  timestamp: number
): NuggetParticleProps[] {
  const nuggetParticles = [];
  for (let i = 0; i < nuggetCount; i++) {
    const nuggetTimestamp = timestamp + i / nuggetCount;

    const xDistance = 0.5 - Math.random();
    const yDistance = -Math.random() / 2;
    const width = (Math.random() * 30 + 10) / DEFAULT_FOUNT_WIDTH;

    nuggetParticles.push({
      id: `${nuggetTimestamp}:${i}`,
      timestamp: nuggetTimestamp,
      xDistance: xDistance,
      yDistance: yDistance,
      width: width,
    });
  }
  return nuggetParticles;
}

function cleanUpNuggetParticles(
  nuggetParticles: NuggetParticleProps[],
  timestamp: number
) {
  return nuggetParticles.filter(
    ({ timestamp: nuggetTimestamp }) =>
      timestamp - nuggetTimestamp < NUGGET_PARTICLE_DURATION_MS * 1.5
  );
}

export function nuggetParticleReducer(
  state: NuggetParticleState,
  action: NuggetParticleAction
) {
  const timestamp = Date.now();

  switch (action.type) {
    case "automatic": {
      if (timestamp - state.previousNuggetTimestamp < REFRESH_TIME) {
        return state;
      }

      const nuggetsToCreate = Math.min(
        action.nuggetCount,
        MAX_NUGGETS_AT_ONCE, // Do not create tons of nuggets at once if nuggetsPerSecond is high
        action.nuggetsPerSecond * 0.1 // Do not create tons of nuggets at once when page is re-entered
      );

      return {
        previousNuggetTimestamp: timestamp,
        nuggetParticles: [
          ...cleanUpNuggetParticles(state.nuggetParticles, timestamp),
          ...createNuggetParticles(nuggetsToCreate, timestamp),
        ],
      };
    }
    case "manual": {
      const nuggetsToCreate = Math.min(action.nuggetCount, MAX_NUGGETS_AT_ONCE);
      return {
        ...state,
        nuggetParticles: [
          ...cleanUpNuggetParticles(state.nuggetParticles, timestamp),
          ...createNuggetParticles(nuggetsToCreate, timestamp),
        ],
      };
    }
    default: {
      return state;
    }
  }
}
