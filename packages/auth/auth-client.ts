import { createAuthClient } from "better-auth/react";
const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
