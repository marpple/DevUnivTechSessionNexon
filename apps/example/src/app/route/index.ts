import { createRouter } from '@rune-ts/server';
import { Session1Route } from '../../pages/session1/session1Route';
import { Session2Route } from '../../pages/session2/session2Route';

type RouterType = typeof Session1Route & typeof Session2Route;

export const ClientRouter = createRouter<RouterType>({
  ...Session1Route,
  ...Session2Route
});
