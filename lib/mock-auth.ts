export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  city?: string;
};

export const mockUsers: AppUser[] = [
  {
    id: "user-1",
    name: "Emma",
    email: "emma@example.com",
    city: "Brussels",
  },
  {
    id: "user-2",
    name: "Lucas",
    email: "lucas@example.com",
    city: "Antwerp",
  },
  {
    id: "user-3",
    name: "Sophie",
    email: "sophie@example.com",
    city: "Ghent",
  },
];

export const currentUser: AppUser = mockUsers[0];

export function getUserById(userId: string) {
  return mockUsers.find((user) => user.id === userId) ?? null;
}