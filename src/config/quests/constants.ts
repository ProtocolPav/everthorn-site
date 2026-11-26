export const QUEST_EXTENSION_DAYS = 7;
export const QUEST_TITLE_MIN_LENGTH = 3;
export const QUEST_DESCRIPTION_MIN_LENGTH = 10;
export const QUEST_DESCRIPTION_MAX_LENGTH = 300;

/** quest_type of the auto-generated daily quests. Not selectable when creating quests. */
export const DAILY_QUEST_TYPE = 'daily';

/** List params for the regular quest views: dailies have their own section. */
export const REGULAR_QUEST_LIST_PARAMS = { exclude_quest_types: [DAILY_QUEST_TYPE] };
