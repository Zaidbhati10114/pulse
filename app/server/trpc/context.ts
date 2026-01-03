import clientPromise from '@/lib/mongodb/mongodb';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';


export async function createContext(opts?: FetchCreateContextFnOptions) {
  const client = await clientPromise;
  const db = client.db('pulse_db'); // your database name

  return {
    db,
    req: opts?.req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;