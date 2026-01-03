import { router } from '../trpc';
import { testRouter } from './test';

export const appRouter = router({
  test: testRouter,
  // Add more routers here as your app grows
});

export type AppRouter = typeof appRouter;