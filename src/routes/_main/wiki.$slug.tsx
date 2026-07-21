import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { NewspaperClippingIcon } from "@phosphor-icons/react";
import { useWikiArticles } from "@/hooks/use-wiki";
import { WikiArticleHeader } from "@/components/features/wiki/wiki-article-header";
import { WikiArticleTags } from "@/components/features/wiki/wiki-article-tags";
import { WikiArticleCard } from "@/components/features/wiki/wiki-article-card";
import { WikiContentEditor } from "@/components/features/wiki/editor/wiki-content-editor.tsx";
import { WikiArticleDetailSkeleton } from "@/components/features/wiki/wiki-article-skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { authClient } from "@/lib/auth-client";
import { useGetWikiPageV1GuildsMeWikiSlugGet } from "@/api/nexuscore/wiki-pages/wiki-pages.ts";

export const Route = createFileRoute("/_main/wiki/$slug")({
    component: WikiArticlePage,
});

function WikiArticlePage() {
    const { slug } = Route.useParams();
    const { data: article, isLoading, error } = useGetWikiPageV1GuildsMeWikiSlugGet(slug);
    const { data: session } = authClient.useSession();

    const { data: relatedArticles } = useWikiArticles({
        category: article?.category,
        published: true,
        page_size: 4,
    });

    const filteredRelated = relatedArticles?.filter((a) => a.page_id !== slug).slice(0, 3);
    const canEdit = !!session?.user && !article?.locked;

    if (isLoading) {
        return <WikiArticleDetailSkeleton />;
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center px-5">
                <Empty className="max-w-md">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <NewspaperClippingIcon />
                        </EmptyMedia>
                        <EmptyTitle>Article not found</EmptyTitle>
                        <EmptyDescription>
                            This article doesn't exist or has been removed.
                        </EmptyDescription>
                        <Link
                            to="/wiki"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-4"
                        >
                            Return to the Archives
                        </Link>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <WikiArticleHeader slug={slug} />

            <div className="px-3 md:px-8 py-0 pb-20 sm:pb-0">
                <div className="max-w-5xl mx-auto">
                    <article>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <WikiContentEditor
                                article={article}
                                canEdit={canEdit}
                            />
                        </motion.div>

                        {article.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-border/50">
                                <WikiArticleTags tags={article.tags} />
                            </div>
                        )}
                    </article>

                    {filteredRelated && filteredRelated.length > 0 && (
                        <motion.section
                            className="mt-16 pt-10 border-t border-border/50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                                More from {article.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredRelated.map((related) => (
                                    <WikiArticleCard
                                        key={related.page_id}
                                        article={related}
                                        variant="compact"
                                    />
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>
            </div>
        </div>
    );
}
