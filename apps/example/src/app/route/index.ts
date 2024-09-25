import { createRouter } from '@rune-ts/server';
import { Session1Route } from '../../pages/session1/session1Route';
import { Session2Route } from '../../pages/session2/session2Route';
import { Session3Route } from "../../pages/session3/session3Route";
import { Session4Route } from "../../pages/session4/session4Route";
import { Session5Route } from "../../pages/session5/session5Route";

type RouterType = typeof Session1Route
  & typeof Session2Route
  & typeof Session2Route
  & typeof Session3Route
  & typeof Session4Route;

export const ClientRouter = createRouter<RouterType>({
  ...Session1Route,
  ...Session2Route,
  ...Session3Route,
  ...Session4Route,
  ...Session5Route,
});
