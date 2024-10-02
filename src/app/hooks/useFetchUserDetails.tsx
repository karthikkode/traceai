import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Function to fetch user assets
const getUserAssets = async (email: string) => {
  try {
    const res = await axios.get("/api/user/getAssetDetails", {
      params: { email },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user assets:", error);
    return null;
  }
};

export const useFetchUserDetails = () => {
  const [traces, setTraces] = useState<any>(null);
  const [projects, setProjects] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        const email = session?.user?.email;
        if (!email) return;
        const { traces, projects, organization, user } = await getUserAssets(
          email
        );
        setTraces(traces);
        setProjects(projects);
        setOrganization(organization);
        setUser(user);
        setLoading(false);
      }
    };

    setLoading(true);
    if (status !== "loading") {
      fetchData();
    }
  }, [session, status]);

  return { traces, projects, user, organization, loading };
};
