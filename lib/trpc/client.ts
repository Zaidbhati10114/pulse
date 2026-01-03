import { AppRouter } from '@/app/server/trpc/routers/_app';
import { createTRPCReact } from '@trpc/react-query';


export const trpc = createTRPCReact<AppRouter>();