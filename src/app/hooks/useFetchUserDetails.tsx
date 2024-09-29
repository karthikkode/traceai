import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db";
import { useSession } from "next-auth/react";
import axios from "axios";

// Fetch User Data
const getUserData = async (email: string) => {
  const user = await axios.get("/api/user/userDetails", {
    params: { email },
  });
  return user.data;
};

// Fetch User's Role Data
const getUserRoleData = async (userRoleId: bigint) => {
  const userRole = await axios.get("/api/user/userRoleDetails", {
    params: { userRoleId },
  });
  return userRole.data;
};

// Fetch Organization Data
const getOrganizationData = async (organizationId: bigint) => {
  const userOrganization = await axios.get("/api/user/userOrganization", {
    params: { organizationId },
  });
  return userOrganization.data;
};

// Fetch User's Journey Data
const getUserAssetData = async (userId: string) => {
  const userAsset = await axios.get("/api/user/userAssetDetails", {
    params: { userId },
  });
  return userAsset.data;
};

const getUserJourneyData = async (userJourneyIds: bigint[]) => {
  const userJourney = await axios.get("/api/user/userJourneyDetails", {
    params: {
      userJourneyIds: userJourneyIds.join(","), // Convert array to comma-separated string
    },
  });
  return userJourney.data;
};

export const useFetchUserDetails = () => {
  const session = useSession();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const [userJourneys, setUserJourneys] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const email = session?.data?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (email) {
          // Fetch user data
          const userData = await getUserData(email);
          setUser(userData);

          // Fetch user role data
          if (userData.userRoleId) {
            const roleData = await getUserRoleData(userData.userRoleId);
            setUserRole(roleData);
          }

          // Fetch user journeys data
          const assetData = await getUserAssetData(userData.id);

          const userJourneyIds = assetData.map((item: any) => item.id);
          const journeyData = await getUserJourneyData(userJourneyIds);
          setUserJourneys(journeyData);

          // Fetch projects data
          let projects: any = [];
          const project = journeyData.map((item: any) =>
            projects.push(item.project)
          );
          setProjects(projects);

          // Fetch organization data if user is part of an organization
          if (userData.organizationId) {
            const organizationData = await getOrganizationData(
              userData.organizationId
            );
            setOrganization(organizationData);
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchData();
    }
  }, [email]);

  return {
    user,
    userRole,
    userJourneys,
    projects,
    organization,
    loading,
    error,
  };
};
