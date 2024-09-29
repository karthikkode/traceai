import { Button } from "./ui/button";
import { doSocialLogin } from "@/app/actions/index";
import { FaGoogle } from "react-icons/fa";
const LoginWithGoogleButton = () => {
  return (
    <form action={doSocialLogin}>
      <Button
        className="m-2"
        variant={"outline"}
        type="submit"
        name="action"
        value="google"
      >
        <div className="flex justify-center items-center">
          <div>
            <FaGoogle className="h-5 w-5 mr-2" />
          </div>
          <div>Use Google Account</div>
        </div>
      </Button>
    </form>
  );
};

export default LoginWithGoogleButton;
