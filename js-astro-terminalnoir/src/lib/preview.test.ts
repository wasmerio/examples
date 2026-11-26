import { expect, it } from 'vitest';
import config from '../../playwright.config';

it('starts its own preview without taking the existing preview lock', () => {
  const server = config.webServer;
  if (!server || Array.isArray(server)) throw new Error('Expected one preview server');
  expect(server.command).toContain('--ignore-lock');
  expect(server.reuseExistingServer).toBe(false);
});
