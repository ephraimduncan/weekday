import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [
    multiSessionClient(),
  ],
});

export const { signIn, signOut, useSession, linkSocial, unlinkAccount, listAccounts } = authClient;

// Export multi-session methods
export const multiSession = {
  listDeviceSessions: () => authClient.multiSession.listDeviceSessions(),
  setActive: (sessionToken: string) => authClient.multiSession.setActive({ sessionToken }),
  revoke: (sessionToken: string) => authClient.multiSession.revoke({ sessionToken }),
};

export type Session = typeof authClient.$Infer.Session;
