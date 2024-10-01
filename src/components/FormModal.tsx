import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/DropdownMenu";

interface DropdownOption {
  value: string;
  label: string;
}

interface FormOptionBase {
  step: number;
  name: string;
  inputType: "input" | "dropdown";
}

interface FormOptionWithDropdown extends FormOptionBase {
  inputType: "dropdown";
  dropdownOptions: DropdownOption[];
  placeHolder?: never;
}

interface FormOptionWithoutDropdown extends FormOptionBase {
  inputType: "input";
  dropdownOptions?: never;
  placeHolder: string;
}

type FormOption = FormOptionWithDropdown | FormOptionWithoutDropdown;

interface FormModalProps {
  ClickButton: React.ElementType;
  title: string;
  description: string;
  options: FormOption[];
}

export function FormModal({
  ClickButton,
  title,
  description,
  options,
}: FormModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ClickButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <div className="items-center">Journey Name</div>
            <div className="items-center mt-2">
              <Input id="name" placeholder="Pedro Duarte" />
            </div>
            <div className="items-center mt-2">App Type</div>
            <div className="items-center mt-2">
              <DropdownMenu
                options={[{ option: "Web Application" }, { option: "Android" }]}
                label={"App Type"}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Next</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
