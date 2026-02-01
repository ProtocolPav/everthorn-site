import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { TargetComponentProps } from "./types";

export const KillTarget = withQuestForm({
  props: {
    objectiveIndex: 0,
    targetIndex: 0,
    namePrefix: "",
  } as TargetComponentProps,

  render: function Render({ form, namePrefix }) {
    return (
      <div className="flex gap-2 items-start">
        <form.AppField
          name={`${namePrefix}.count`}
          children={(field) => <field.TargetCountField />}
        />
        <form.AppField
          name={`${namePrefix}.entity`}
          children={(field) => <field.TargetEntityField />}
        />
      </div>
    );
  },
});
