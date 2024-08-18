import { createRouter } from '@rune-ts/server';
import { Session1Route } from '../../pages/session1/session1Route';

type RouterType = typeof Session1Route;

export const ClientRouter = createRouter<RouterType>({
  ...Session1Route,
});
