import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const testRouter = router({
  // Simple hello query
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Create a test document in MongoDB
  createTestUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.collection('test_users').insertOne({
        name: input.name,
        email: input.email,
        createdAt: new Date(),
      });

      return {
        success: true,
        id: result.insertedId.toString(),
        message: 'User created successfully!',
      };
    }),

  // Get all test users from MongoDB
  getTestUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db
      .collection('test_users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return {
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })),
    };
  }),
});