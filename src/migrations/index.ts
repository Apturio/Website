import * as migration_20260607_225402_initial from './20260607_225402_initial';

export const migrations = [
  {
    up: migration_20260607_225402_initial.up,
    down: migration_20260607_225402_initial.down,
    name: '20260607_225402_initial',
  },
];
