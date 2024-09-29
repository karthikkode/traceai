import { Button } from "./ui/button";
import { doSocialLogin } from "@/app/actions/index";
import { FaGithub } from "react-icons/fa";
const LoginWithGithubButton = () => {
  return (
    <form action={doSocialLogin}>
      <Button
        className="m-2"
        variant={"outline"}
        type="submit"
        name="action"
        value="github"
      >
        <div className="flex justify-center items-center">
          <div>
            <FaGithub className="h-5 w-5 mr-2" />
          </div>
          <div>Use Github Account</div>
        </div>
      </Button>
    </form>
  );
};

export default LoginWithGithubButton;
