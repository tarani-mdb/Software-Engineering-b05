// Simple in-memory user store for demonstration. Replace with DB in production.
interface User {
  email: string;
  password: string; // hashed
}

const users: User[] = [];

export async function saveUser(user: User): Promise<User> {
  users.push(user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find((u) => u.email === email);
}
