import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Clock, FileText } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/hooks/use-thorny-user';
import { interactionTypes, dimensions } from '@/lib/interactions';
import type { Interaction } from '@/types/interactions';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface InteractionRowProps {
    interaction: Interaction;
}

export function InteractionRow({ interaction }: InteractionRowProps) {
    const { user } = useUser(interaction.thorny_id);
    const typeConfig = interactionTypes[interaction.type as keyof typeof interactionTypes];
    const dimensionConfig = dimensions[interaction.dimension as keyof typeof dimensions];
    const Icon = typeConfig?.icon || FileText;

    return (
        <TableRow className="hover:bg-muted/50 border-b border-border/30">
            {/* User Column */}
            <TableCell className="font-medium py-3">
                <div className="flex items-center gap-2">
                    {
                        user?.xuid ? (
                            <Avatar>
                                <AvatarImage
                                    src={`https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${user.xuid}/image/head`}
                                    alt={'Minecraft Avatar'}
                                />
                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold">
                                <User className="w-4 h-4" />
                            </div>
                        )
                    }

                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                            {user?.whitelist ?? <Skeleton className="w-16 h-4" />}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ID: {interaction.thorny_id}{user?.username && ` • @${user.username}`}
                        </div>
                    </div>
                </div>
            </TableCell>

            {/* Action Column */}
            <TableCell className="py-3">
                <Badge variant={typeConfig?.variant || 'outline'} className="gap-1">
                    <Icon className="w-3 h-3" />
                    {typeConfig?.label || interaction.type}
                </Badge>
            </TableCell>

            {/* Reference Column */}
            <TableCell className="py-3">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                    {interaction.reference}
                </code>
            </TableCell>

            {/* Mainhand Column */}
            <TableCell className="py-3">
                {interaction.mainhand ? (
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                        {interaction.mainhand}
                    </code>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
            </TableCell>

            {/* Location Column */}
            <TableCell className="py-3">
                <div className="flex items-center gap-1">
                    <Image
                        src={dimensionConfig.img}
                        alt={dimensionConfig.label}
                        width={24}
                        height={24}
                        className="object-cover rounded-sm"
                    />
                    <code className="text-xs text-muted-foreground">
                        [{interaction.coordinates.join(', ')}]
                    </code>
                </div>
            </TableCell>

            {/* Time Column */}
            <TableCell className="py-3">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <div className="space-y-0">
                        <div className="text-xs font-medium">
                            {new Date(interaction.time).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {new Date(interaction.time).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}
