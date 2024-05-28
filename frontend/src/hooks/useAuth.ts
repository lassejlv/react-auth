import { useState, useEffect } from "react";

interface User {
  username: string;
}

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (token) {
      const tokenValue = token.split("=")[1];

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/ping`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: tokenValue }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const { data } = (await response.json()) as { data: User };
          setUser(data);
          setError(null);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
      setError({ message: "No token found" } as Error);
    }
  }, []);

  return { data: user, loading, error };
}

export default useAuth;
