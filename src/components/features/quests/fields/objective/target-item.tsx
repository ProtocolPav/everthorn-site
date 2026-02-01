import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import { AppForm } from "@/components/features/quests/quest-form.ts";
import { getTargetComponent, TargetType } from "@/components/features/quests/targets";

interface TargetItemProps {
  form: AppForm;
  objectiveIndex: number;
  targetIndex: number;
  targetType: TargetType;
  onRemove: () => void;
}

export function TargetItem({
  form,
  objectiveIndex,
  targetIndex,
  targetType,
  onRemove,
}: TargetItemProps) {
  const TargetComponent = getTargetComponent(targetType);
  const namePrefix = `objectives[${objectiveIndex}].targets[${targetIndex}]`;

  if (!TargetComponent) {
    return (
      <div className="text-destructive text-sm">
        Unknown target type: {targetType}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <TargetComponent
          form={form}
          objectiveIndex={objectiveIndex}
          targetIndex={targetIndex}
          namePrefix={namePrefix}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
        onClick={onRemove}
        type="button"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}
