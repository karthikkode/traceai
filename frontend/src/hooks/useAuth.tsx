import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import axios from "axios";

interface Organization {
  id: string;
  name: string;
}

export const useAuth = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null); // Typed state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        await fetchOrganizationDetails(data.user.id); // Fetch organization details
      } else {
        setUser(null);
        setOrganization(null); // Clear organization details if no user
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };

    const fetchOrganizationDetails = async (userId: string) => {
      try {
        const response = await axios.get(
          `${backendUrl}/user/organization/${userId}`
        );
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization details:", error);
        setOrganization(null);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user || null;
      setUser(user);
      if (user) {
        await fetchOrganizationDetails(user.id); // Fetch organization details on auth change
      } else {
        setOrganization(null); // Clear organization details on logout
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  return { user, organization, loading };
};
