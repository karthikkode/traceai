import { useAuth } from "@/hooks/useAuth";
import TopBar from "./TopBar";

function Home() {
  const { user, organization, loading } = useAuth();
  console.log(user, loading);
  console.log(organization);
  return (
    <div>
      <TopBar></TopBar>
    </div>
  );
}

export default Home;
