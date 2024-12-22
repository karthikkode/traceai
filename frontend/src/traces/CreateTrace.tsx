import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { CircleMinus } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const { user, loading, organization } = useAuth();

interface Condition {
  id: number;
  metricName: string;
  eventType: string;
  regexFilter: string;
  value: string;
}

interface StepGroup {
  id: number;
  conditions: Condition[];
}

interface Step {
  id: number;
  name: string;
  groups: StepGroup[];
}

function TraceBuilder() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      name: "New Step",
      groups: [
        {
          id: 1,
          conditions: [
            {
              id: 1,
              metricName: "",
              eventType: "",
              regexFilter: "",
              value: "",
            },
          ],
        },
      ],
    },
  ]);
  const [trace, setTrace] = useState<any>(null);
  const [traceName, setTraceName] = useState<string>("New Trace");
  const [nextStepId, setNextStepId] = useState(2);
  const [nextGroupId, setNextGroupId] = useState(2);
  const [nextConditionId, setNextConditionId] = useState(2);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  // Add Condition
  const addCondition = (stepId: number, groupId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              groups: step.groups.map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      conditions: [
                        ...group.conditions,
                        {
                          id: nextConditionId,
                          metricName: "",
                          eventType: "",
                          regexFilter: "",
                          value: "",
                        },
                      ],
                    }
                  : group
              ),
            }
          : step
      )
    );
    setNextConditionId((prev) => prev + 1);
    setIsChanged(true);
  };

  // Add Group
  const addGroup = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              groups: [
                ...step.groups,
                {
                  id: nextGroupId,
                  conditions: [
                    {
                      id: nextConditionId,
                      metricName: "",
                      eventType: "",
                      regexFilter: "",
                      value: "",
                    },
                  ],
                },
              ],
            }
          : step
      )
    );
    setNextGroupId((prev) => prev + 1);
    setNextConditionId((prev) => prev + 1);
  };

  // Add Step
  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: nextStepId,
        name: "New Step",
        groups: [
          {
            id: 1,
            conditions: [
              {
                id: 1,
                metricName: "",
                eventType: "",
                regexFilter: "",
                value: "",
              },
            ],
          },
        ],
      },
    ]);
    setNextStepId((prev) => prev + 1);
    setNextGroupId(2);
    setNextConditionId(2);
    setIsChanged(true);
  };

  // Remove Step
  const removeStep = (stepId: number) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
    setIsChanged(true);
  };

  // Remove Group
  const removeGroup = (stepId: number, groupId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              groups: step.groups.filter((group) => group.id !== groupId),
            }
          : step
      )
    );
    setIsChanged(true);
  };

  // Remove Condition
  const removeCondition = (
    stepId: number,
    groupId: number,
    conditionId: number
  ) => {
    const newStep: Step[] = steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            groups: step.groups.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    conditions: group.conditions.filter(
                      (cond) => cond.id !== conditionId
                    ),
                  }
                : group
            ),
          }
        : step
    );
    setSteps(newStep);
    setIsChanged(true);
  };

  // Update condition value
  const updateCondition = (
    stepId: number,
    groupId: number,
    conditionId: number,
    field: keyof Condition,
    value: string
  ) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              groups: step.groups.map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      conditions: group.conditions.map((condition) =>
                        condition.id === conditionId
                          ? { ...condition, [field]: value }
                          : condition
                      ),
                    }
                  : group
              ),
            }
          : step
      )
    );
    setIsChanged(true);
  };

  const saveTrace = async (traceId: string, updatedTrace: any) => {
    try {
      const response = await axios.put(
        `${backendUrl}/traces/${traceId}`,
        updatedTrace,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Trace updated successfully:", response.data);
      alert("Trace updated successfully!");
    } catch (error) {
      console.error("Error updating trace:", error);
      alert("Failed to update trace. Please try again.");
    }
  };

  // useEffect(() => {
  //   const newTrace: any = {
  //     name: "",
  //     data: {},
  //     organizationId: "",
  //   };
  //   newTrace.name = traceName;
  //   newTrace.data.steps = steps;
  //   newTrace.organizationId = organization?.id;
  //   setTrace(newTrace);
  //   console.log(steps);
  // }, [steps, traceName, organization]);

  useEffect(() => {
    console.log("Updated Steps State: ", JSON.stringify(steps, null, 2));
  }, [steps]);

  return (
    <>
      <TopBar />
      <div className="flex justify-between items-center mt-4 mx-4">
        <div className="w-1/3 flex justify-start">
          <Input
            type="text"
            placeholder="New Trace"
            value={traceName}
            onChange={(e) => {
              setTraceName(e.target.value);
              setIsChanged(true);
            }}
          />
        </div>
        <div className="flex justify-end">
          {isChanged && <Button size="sm">Save Changes</Button>}
        </div>
      </div>
      <div className="p-4 space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="border rounded p-4 space-y-4 bg-gray-900 text-white"
          >
            {/* Step Name */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-bold">Step:</span>
                <Input
                  value={step.name}
                  placeholder="Step Name"
                  onChange={(e) =>
                    updateCondition(step.id, 0, 0, "value", e.target.value)
                  }
                  className="w-60"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeStep(step.id)}
              >
                <CircleMinus />
              </Button>
            </div>

            {/* Groups */}
            {step.groups.map((group) => (
              <div key={group.id} className="border rounded p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-sm">Group</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeGroup(step.id, group.id)}
                  >
                    <CircleMinus />
                  </Button>
                </div>

                {/* Conditions */}
                {group.conditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex space-x-2 items-center"
                  >
                    <Select
                      onValueChange={(value) =>
                        updateCondition(
                          step.id,
                          group.id,
                          condition.id,
                          "metricName",
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Metric Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="button">Button</SelectItem>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) =>
                        updateCondition(
                          step.id,
                          group.id,
                          condition.id,
                          "eventType",
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="click">Click</SelectItem>
                        <SelectItem value="submit">Submit</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) =>
                        updateCondition(
                          step.id,
                          group.id,
                          condition.id,
                          "regexFilter",
                          value
                        )
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Regex Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Condition"
                      value={condition.value}
                      onChange={(e) =>
                        updateCondition(
                          step.id,
                          group.id,
                          condition.id,
                          "value",
                          e.target.value
                        )
                      }
                      className="w-60"
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        removeCondition(step.id, group.id, condition.id)
                      }
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                ))}

                <Button
                  size="sm"
                  onClick={() => addCondition(step.id, group.id)}
                >
                  Or
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => addGroup(step.id)}
            >
              And
            </Button>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <Button size="sm" onClick={addStep}>
            Add Step
          </Button>
        </div>
      </div>
    </>
  );
}

export default TraceBuilder;
