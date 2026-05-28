export const passwordAuth = {
  login: async (email: string, password: string) => {
    const validEmail = "moh17670s@gmail.com";
    const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || "";

    if (email === validEmail && password === PASSWORD) {
      return { success: true };
    }
    return { success: false, error: "Felaktig e-post eller lösenord" };
  },
  logout: async () => {},
  resetPassword: async (email: string) => {
    if (email) return { success: true };
    return { success: false, error: "Email required" };
  },
};
