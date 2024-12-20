import { useAuth } from "@/hooks/useAuth";
import TopBar from "./TopBar";

function Home() {
  const {user, loading} = useAuth()
  console.log(user, loading)
  return (
    <div>
      <TopBar></TopBar>

    </div>
  );
}

export default Home;
