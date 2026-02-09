import {createFormHook} from "@tanstack/react-form";
import {fieldContext, formContext} from "@/hooks/use-form-context.ts";
import {QuestTitleField} from "@/components/features/quests/fields/title.tsx";
import {QuestTypeField} from "@/components/features/quests/fields/quest-type.tsx";
import {QuestTimeField} from "@/components/features/quests/fields/time-range.tsx";
import {QuestDescriptionField} from "@/components/features/quests/fields/description.tsx";
import {QuestTagsField} from "@/components/features/quests/fields/tags.tsx";
import {ObjectiveDescriptionField} from "@/components/features/quests/fields/objective/description.tsx";
import {TargetLogicField} from "@/components/features/quests/fields/target/target-logic.tsx";
import {TargetCountField} from "@/components/features/quests/fields/target/target-count.tsx";
import {ObjectiveDisplayField} from "@/components/features/quests/fields/objective/display.tsx";
import {ObjectiveTypeField} from "@/components/features/quests/fields/objective/objective-type.tsx";

export const {useAppForm: useQuestForm, withForm: withQuestForm} =
    createFormHook({
        fieldContext,
        formContext,
        fieldComponents: {
            QuestTitleField,
            QuestTypeField,
            QuestTimeField,
            QuestDescriptionField,
            QuestTagsField,
            ObjectiveDescriptionField,
            ObjectiveTypeField,
            ObjectiveDisplayField,
            TargetCountField,
            TargetLogicField,
        },
        formComponents: {},
    });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppForm = any;
