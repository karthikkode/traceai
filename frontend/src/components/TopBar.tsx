import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold">T</span>
        </div>
      </div>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">Payment</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/payment/setup")}>
              Setup
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            onClick={() => navigate("/alltraces")}
            className="cursor-pointer"
          >
            Traces
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            onClick={() => navigate("/setup")}
          >
            Setup
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <Button
        variant="ghost"
        className="h-10 w-10 rounded-full bg-gray-600"
      ></Button>
    </div>
  );
};

export default TopBar;
