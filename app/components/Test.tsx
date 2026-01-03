"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

export function Test() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Test queries
  const helloQuery = trpc.test.hello.useQuery({ name: "Developer" });
  const usersQuery = trpc.test.getTestUsers.useQuery();

  // Test mutation
  const createUserMutation = trpc.test.createTestUser.useMutation({
    onSuccess: () => {
      // Refetch users after creating
      usersQuery.refetch();
      setName("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({ name, email });
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">tRPC + MongoDB Test</h1>

      {/* Test Query */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Query</h2>
        {helloQuery.isLoading && <p>Loading...</p>}
        {helloQuery.error && (
          <p className="text-red-500">Error: {helloQuery.error.message}</p>
        )}
        {helloQuery.data && (
          <div className="space-y-2">
            <p className="text-lg">{helloQuery.data.greeting}</p>
            <p className="text-sm text-gray-500">{helloQuery.data.timestamp}</p>
          </div>
        )}
      </div>

      {/* Create User Form */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create Test User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded text-red-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded text-red-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {createUserMutation.isPending ? "Creating..." : "Create User"}
          </button>
          {createUserMutation.error && (
            <p className="text-red-500">
              Error: {createUserMutation.error.message}
            </p>
          )}
          {createUserMutation.data && (
            <p className="text-green-500">{createUserMutation.data.message}</p>
          )}
        </form>
      </div>

      {/* Display Users */}
      <div className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Users from MongoDB</h2>
        {usersQuery.isLoading && <p>Loading users...</p>}
        {usersQuery.error && (
          <p className="text-red-500">Error: {usersQuery.error.message}</p>
        )}
        {usersQuery.data && (
          <div className="space-y-4">
            {usersQuery.data.users.length === 0 ? (
              <p className="text-gray-500">No users yet. Create one above!</p>
            ) : (
              usersQuery.data.users.map((user) => (
                <div key={user.id} className="p-4 bg-gray-50 rounded">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
