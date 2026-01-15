import { useEffect, useState } from "react";
import { initAuthListener } from "@/services/auth.listener";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = initAuthListener(() => {
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  if (!authReady) {
    return <div>Loading...</div>;
  }

  return <AppRoutes />;
}

export default App;
