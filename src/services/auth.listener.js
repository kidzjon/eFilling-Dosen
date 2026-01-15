import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ensureUserProfile, getCurrentUserProfile } from "./auth.service";

export function initAuthListener(setUser) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setUser(null);
      return;
    }

    await ensureUserProfile(user);
    const profile = await getCurrentUserProfile();
    setUser(profile);
  });
}
