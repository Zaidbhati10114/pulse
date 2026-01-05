import { router } from '../trpc';
import { subscriberRouter } from './subscriber';
import { testRouter } from './test';

export const appRouter = router({
  test: testRouter,
  subscriber: subscriberRouter,
  // Add more routers here as your app grows
});

export type AppRouter = typeof appRouter;