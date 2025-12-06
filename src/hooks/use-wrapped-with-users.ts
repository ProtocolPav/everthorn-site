// hooks/use-wrapped-with-users.ts
import { useWrapped } from './use-wrapped';
import { useUsers } from './use-thorny-user';
import { useMemo } from 'react';
import {EverthornWrapped, EverthornWrappedEnriched} from "@/types/wrapped";

export function useWrappedWithUsers(thornyId: number | null) {
    const { wrapped, isLoading: wrappedLoading, isError: wrappedError, mutate } = useWrapped(thornyId);

    // Extract player IDs from social metrics
    const playerIds = useMemo(() => {
        if (!wrapped?.social?.favourite_people) return [];
        return wrapped.social.favourite_people.map(person => person.other_player_id);
    }, [wrapped?.social?.favourite_people]);

    // Fetch user details for all favourite people
    const { users, isLoading: usersLoading, errors: usersErrors } = useUsers(playerIds);

    // Combine wrapped data with enriched user data
    const enrichedWrapped = useMemo((): EverthornWrappedEnriched | null => {
        if (!wrapped) return null;

        // If no social data, return wrapped as-is (cast to enriched type)
        if (!wrapped.social?.favourite_people) {
            return wrapped as EverthornWrappedEnriched;
        }

        // Map user data to favourite people
        const enrichedPeople = wrapped.social.favourite_people.map(person => {
            const user = users.find(u => u.thorny_id === person.other_player_id);
            return {
                ...person,
                user: user || null, // Include full user object if found
            };
        });

        return {
            ...wrapped,
            social: {
                favourite_people: enrichedPeople,
            },
        } as EverthornWrappedEnriched;
    }, [wrapped, users]);

    return {
        wrapped: enrichedWrapped,
        isLoading: wrappedLoading || (playerIds.length > 0 && usersLoading),
        isError: wrappedError || (usersErrors.length > 0),
        mutate,
    };
}
