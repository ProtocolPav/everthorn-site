import type { ThornyUser } from "@/types/thorny-user";
import { Card, CardContent } from "@/components/ui/card";

interface WikiArticleAuthorCardProps {
    author: ThornyUser;
}

export function WikiArticleAuthorCard({ author }: WikiArticleAuthorCardProps) {
    return (
        <Card className="bg-muted/30">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Written by</p>
                        <h4 className="font-semibold text-sm mb-0.5">
                            {author.profile?.character_name ?? author.username}
                        </h4>
                        {author.profile?.character_role && (
                            <p className="text-xs text-muted-foreground mb-2">
                                {author.profile.character_role}
                                {author.profile.character_origin && ` — ${author.profile.character_origin}`}
                            </p>
                        )}
                        {author.profile?.lore && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                                {author.profile.lore}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
