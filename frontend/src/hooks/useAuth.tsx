import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user || null;
      setUser(user);
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
