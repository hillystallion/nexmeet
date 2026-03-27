import "next-auth";

declare module "next-auth" {
  interface User {
    code?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      code: string;
      role: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    code: string;
    role: string;
  }
}
