import { demoUsers } from "../utils/mockData";
import { simulateRequest } from "./client";

const SESSION_KEY = "broadcast_session";

export const authService = {
  async login({ email, password }) {
    const user = demoUsers.find((item) => item.email === email && item.password === password);
    if (!user) {
      await simulateRequest(null, { delay: 350, failRate: 0 });
      throw new Error("Invalid email or password.");
    }

    const session = {
      token: `mock-token-${user.role}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return simulateRequest(session, { failRate: 0 });
  },

  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
