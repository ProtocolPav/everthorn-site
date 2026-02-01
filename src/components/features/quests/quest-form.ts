import {createFormHook} from "@tanstack/react-form";
import {fieldContext, formContext} from "@/hooks/use-form-context.ts";
import {QuestTitleField} from "@/components/features/quests/fields/title.tsx";
import {QuestTypeField} from "@/components/features/quests/fields/quest-type.tsx";
import {QuestTimeField} from "@/components/features/quests/fields/time-range.tsx";
import {QuestDescriptionField} from "@/components/features/quests/fields/description.tsx";
import {QuestTagsField} from "@/components/features/quests/fields/tags.tsx";
import {QuestObjectiveCard} from "@/components/features/quests/fields/objective.tsx";
import {ObjectiveDescriptionField} from "@/components/features/quests/fields/objective/description.tsx";

export const { useAppForm: useQuestForm, withForm: withQuestForm,} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        QuestTitleField,
        QuestTypeField,
        QuestTimeField,
        QuestDescriptionField,
        QuestTagsField,
        ObjectiveDescriptionField
    },
    formComponents: {
        QuestObjectiveCard
    }
})