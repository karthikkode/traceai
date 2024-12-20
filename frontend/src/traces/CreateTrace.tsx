import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CircleMinus } from "lucide-react";
import TopBar from "@/components/TopBar";

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
      groups: [{ id: 1, conditions: [{ id: 1, metricName: "", eventType: "", regexFilter: "", value: "" }] }],
    },
  ]);

  const [nextStepId, setNextStepId] = useState(2);
  const [nextGroupId, setNextGroupId] = useState(2);
  const [nextConditionId, setNextConditionId] = useState(2);

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
                        { id: nextConditionId, metricName: "", eventType: "", regexFilter: "", value: "" },
                      ],
                    }
                  : group
              ),
            }
          : step
      )
    );
    setNextConditionId((prev) => prev + 1);
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
                  conditions: [{ id: nextConditionId, metricName: "", eventType: "", regexFilter: "", value: "" }],
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
        groups: [{ id: 1, conditions: [{ id: 1, metricName: "", eventType: "", regexFilter: "", value: "" }] }],
      },
    ]);
    setNextStepId((prev) => prev + 1);
    setNextGroupId(2);
    setNextConditionId(2);
  };

  // Remove Step
  const removeStep = (stepId: number) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  // Remove Group
  const removeGroup = (stepId: number, groupId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, groups: step.groups.filter((group) => group.id !== groupId) } : step
      )
    );
  };

  // Remove Condition
  const removeCondition = (stepId: number, groupId: number, conditionId: number) => {
    console.log(steps)
  const newStep: Step[] = steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            groups: step.groups.map((group) =>
              group.id === groupId
                ? { ...group, conditions: group.conditions.filter((cond) => cond.id !== conditionId) }
                : group
            ),
          }
        : step
    )
    console.log(newStep)
    setSteps(newStep);
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
                        condition.id === conditionId ? { ...condition, [field]: value } : condition
                      ),
                    }
                  : group
              ),
            }
          : step
      )
    );
  };

  const [loggedData, setLoggedData] = useState<Step[]>([]);

  useEffect(() => {
    // Log the steps state into a single variable
    setLoggedData(steps);

    // Optional: Log it to the console for debugging
    console.log(loggedData);
  }, [steps]);

  return (
    <>
    <TopBar/>
    <div className="p-4 space-y-6">
      {steps.map((step) => (
        <div key={step.id} className="border rounded p-4 space-y-4 bg-gray-900 text-white">
          {/* Step Name */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Step:</span>
              <Input
                value={step.name}
                placeholder="Step Name"
                onChange={(e) => updateCondition(step.id, 0, 0, "value", e.target.value)}
                className="w-60"
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeStep(step.id)}>
              <CircleMinus />
            </Button>
          </div>

          {/* Groups */}
          {step.groups.map((group) => (
            <div key={group.id} className="border rounded p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">Group</div>
                <Button variant="destructive" size="sm" onClick={() => removeGroup(step.id, group.id)}>
                  <CircleMinus />
                </Button>
              </div>

              {/* Conditions */}
              {group.conditions.map((condition) => (
                <div key={condition.id} className="flex space-x-2 items-center">
                  <Select
                    onValueChange={(value) =>
                      updateCondition(step.id, group.id, condition.id, "metricName", value)
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
                      updateCondition(step.id, group.id, condition.id, "eventType", value)
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
                      updateCondition(step.id, group.id, condition.id, "regexFilter", value)
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
                      updateCondition(step.id, group.id, condition.id, "value", e.target.value)
                    }
                    className="w-60"
                  />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCondition(step.id, group.id, condition.id)}
                  >
                    <CircleMinus />
                  </Button>
                </div>
              ))}

              <Button size="sm" onClick={() => addCondition(step.id, group.id)}>
                Or
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => addGroup(step.id)}>
            And
          </Button>
        </div>
      ))}

    <div className="flex justify-center mt-4">
      <Button size="sm" className="" onClick={addStep}>
        Add Step
      </Button>
    </div>
    </div>
    </>
  );
}

export default TraceBuilder;
