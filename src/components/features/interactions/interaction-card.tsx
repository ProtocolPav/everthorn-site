import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon, ClockIcon, FileTextIcon } from '@phosphor-icons/react';
import { useThornyUser } from '@/hooks/use-thorny-user';
import { interactionTypes, dimensions } from '@/config/interactions-config.ts';
import type { Interaction } from '@/types/interactions';

interface InteractionRowProps {
    interaction: Interaction;
}

export function InteractionCard({ interaction }: InteractionRowProps) {
    const { data: user } = useThornyUser(interaction.thorny_id);

    const typeConfig = interactionTypes[interaction.type as keyof typeof interactionTypes];
    const dimensionConfig = dimensions[interaction.dimension as keyof typeof dimensions];
    const Icon = typeConfig?.icon ?? FileTextIcon;

    const avatarSrc = user?.xuid
        ? `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${user.xuid}/image/head`
        : undefined;

    return (
        <TableRow className="hover:bg-muted/50 border-b border-border/30">

            {/* User */}
            <TableCell className="py-3 font-medium">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={avatarSrc} alt="Minecraft Avatar" />
                        <AvatarFallback>
                            <UserIcon className="size-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {user?.whitelist ?? <Skeleton className="h-4 w-16" />}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            ID: {interaction.thorny_id}
                            {user?.username && ` • @${user.username}`}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* Action */}
            <TableCell className="py-3">
                <Badge variant={typeConfig?.variant ?? 'outline'} className="gap-1">
                    <Icon className="size-3" />
                    {typeConfig?.label ?? interaction.type}
                </Badge>
            </TableCell>

            {/* Reference */}
            <TableCell className="py-3">
                <code className="rounded bg-muted px-2 py-1 text-xs">
                    {interaction.reference}
                </code>
            </TableCell>

            {/* Mainhand */}
            <TableCell className="py-3">
                {interaction.mainhand ? (
                    <code className="rounded bg-muted px-2 py-1 text-xs">
                        {interaction.mainhand}
                    </code>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )}
            </TableCell>

            {/* Location */}
            <TableCell className="py-3">
                <div className="flex items-center gap-1">
                    <img
                        src={dimensionConfig.img}
                        alt={dimensionConfig.label}
                        width={24}
                        height={24}
                        className="rounded-sm object-cover"
                    />
                    <code className="text-xs text-muted-foreground">
                        [{interaction.coordinates.join(', ')}]
                    </code>
                </div>
            </TableCell>

            {/* Time */}
            <TableCell className="py-3">
                <div className="flex items-center gap-1">
                    <ClockIcon className="size-3 text-muted-foreground" />
                    <div>
                        <p className="text-xs font-medium">
                            {new Date(interaction.time).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(interaction.time).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </TableCell>

        </TableRow>
    );
}