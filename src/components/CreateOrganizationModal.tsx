import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFetchUserDetails } from "@/app/hooks/useFetchUserDetails";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateOrganizationModal() {
  const { organization, user, loading } = useFetchUserDetails();
  const [open, setOpen] = useState(true);
  const [organizationName, setOrganizationName] = useState("");
  // Open the modal if organization is null
  useEffect(() => {
    if (!loading && organization === null) {
      setOpen(true); // Open the modal when organization is null
    }
  }, [loading, organization]);

  const handleCreateOrganization = async () => {
    try {
      await axios.post("/api/create/organization", {
        organizationName: organizationName,
        userId: user.id,
      });

      // Close the modal after creation
      setOpen(false);
      console.log("Organization created successfully!");
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  return (
    <div>
      {/* The Modal is conditionally opened based on organization being null */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Organization</DialogTitle>
            <DialogDescription>
              Please enter the name of your organization to proceed.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="my-4"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="default"
              onClick={handleCreateOrganization}
              disabled={!organizationName} // Disable button if no name is entered
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
