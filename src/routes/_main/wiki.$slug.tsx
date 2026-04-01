import { createFileRoute, Link } from "@tanstack/react-router";
import { useWikiArticle, useWikiArticles } from "@/hooks/use-wiki";
import { WikiArticleHeader, WikiArticleAuthorCard, WikiArticleTags } from "@/components/features/wiki/wiki-article-header";
import { WikiArticleCard } from "@/components/features/wiki/wiki-article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { NewspaperClippingIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

export const Route = createFileRoute("/_main/wiki/$slug")({
    component: WikiArticlePage,
});

function WikiArticlePage() {
    const { slug } = Route.useParams();
    const { data: article, isLoading, error } = useWikiArticle(slug);

    // Fetch related articles from same category
    const { data: relatedArticles } = useWikiArticles({
        category: article?.category,
        published: true,
        page_size: 4,
    });

    // Filter out current article from related
    const filteredRelated = relatedArticles?.filter((a) => a.page_id !== slug).slice(0, 3);

    if (isLoading) {
        return <WikiArticleSkeleton />;
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
                    {/* Main content */}
                    <article>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-minecraft-seven prose-headings:tracking-normal prose-p:leading-relaxed prose-p:text-[0.9375rem] prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                        >
                            {article.content ? (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            ) : (
                                <div className="text-muted-foreground italic">
                                    This article has no content yet.
                                </div>
                            )}
                        </motion.div>

                        {/* Tags */}
                        {article.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-border/50">
                                <WikiArticleTags tags={article.tags} />
                            </div>
                        )}
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Author card */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <WikiArticleAuthorCard author={article.author} />
                        </motion.div>

                        {/* Related articles */}
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

function WikiArticleSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Cover skeleton */}
            <Skeleton className="w-full h-[35vh]" />

            <div className="px-5 md:px-10 -mt-16 relative z-10">
                <Skeleton className="h-3 w-24 mb-6" />
                <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-10 w-3/4 mb-3" />
                <Skeleton className="h-5 w-1/2 mb-6" />
                <div className="flex gap-5 pb-6 border-b border-border/50">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            <div className="px-5 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
