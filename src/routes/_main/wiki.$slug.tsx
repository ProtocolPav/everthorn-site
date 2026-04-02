import { createFileRoute, Link } from "@tanstack/react-router";
import { useWikiArticle, useWikiArticles } from "@/hooks/use-wiki";
import { WikiArticleHeader } from "@/components/features/wiki/wiki-article-header";
import { WikiArticleAuthorCard } from "@/components/features/wiki/wiki-article-author-card";
import { WikiArticleTags } from "@/components/features/wiki/wiki-article-tags";
import { WikiArticleCard } from "@/components/features/wiki/wiki-article-card";
import { WikiContentEditor } from "@/components/features/wiki/wiki-content-editor";
import { WikiArticleDetailSkeleton } from "@/components/features/wiki/wiki-article-skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { NewspaperClippingIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_main/wiki/$slug")({
    component: WikiArticlePage,
});

function WikiArticlePage() {
    const { slug } = Route.useParams();
    const { data: article, isLoading, error } = useWikiArticle(slug);
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
            <WikiArticleHeader article={article} />

            <div className="px-5 md:px-10 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-6xl mx-auto">
                    <article>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
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

                    <aside className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <WikiArticleAuthorCard author={article.author} />
                        </motion.div>

                        {filteredRelated && filteredRelated.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                                    Related Articles
                                </p>
                                <div className="space-y-2">
                                    {filteredRelated.map((related) => (
                                        <WikiArticleCard
                                            key={related.page_id}
                                            article={related}
                                            variant="compact"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
