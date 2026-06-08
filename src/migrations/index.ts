import * as migration_20260607_225402_initial from './20260607_225402_initial';
import * as migration_20260608_044507_phase13_plugins from './20260608_044507_phase13_plugins';
import * as migration_20260608_160217_phase16_jsonld_override from './20260608_160217_phase16_jsonld_override';

export const migrations = [
  {
    up: migration_20260607_225402_initial.up,
    down: migration_20260607_225402_initial.down,
    name: '20260607_225402_initial',
  },
  {
    up: migration_20260608_044507_phase13_plugins.up,
    down: migration_20260608_044507_phase13_plugins.down,
    name: '20260608_044507_phase13_plugins',
  },
  {
    up: migration_20260608_160217_phase16_jsonld_override.up,
    down: migration_20260608_160217_phase16_jsonld_override.down,
    name: '20260608_160217_phase16_jsonld_override'
  },
];
