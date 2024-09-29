import { Button } from "./ui/button";
import { doLogout } from "@/app/actions";
const Logout = () => {
  return (
    <form action={doLogout}>
      <Button type="submit">Logout</Button>
    </form>
  );
};

export default Logout;
