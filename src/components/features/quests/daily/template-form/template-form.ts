import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/use-form-context.ts";
import { QuestTitleField } from "@/components/features/quests/fields/title.tsx";
import { QuestDescriptionField } from "@/components/features/quests/fields/description.tsx";
import { ObjectiveDescriptionField } from "@/components/features/quests/fields/objective/description.tsx";
import { ObjectiveDisplayField } from "@/components/features/quests/fields/objective/display.tsx";
import { ObjectiveTypeField } from "@/components/features/quests/fields/objective/objective-type.tsx";
import { TargetLogicField } from "@/components/features/quests/fields/target/target-logic.tsx";
import { RandomCountField } from "@/components/features/quests/daily/template-form/random-count-field.tsx";

/**
 * Form hook for daily templates. Shares the quest form's contexts, so the
 * quest editor's field components work here unchanged.
 */
export const { useAppForm: useTemplateForm, withForm: withTemplateForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        QuestTitleField,
        QuestDescriptionField,
        ObjectiveDescriptionField,
        ObjectiveDisplayField,
        ObjectiveTypeField,
        TargetLogicField,
        RandomCountField,
    },
    formComponents: {},
});
