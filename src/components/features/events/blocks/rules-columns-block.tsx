import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import type { RulesColumnsBlock as RulesColumnsBlockType } from '@/api/nexuscore/model'

interface RulesColumnsBlockProps {
    block: RulesColumnsBlockType
}

export function RulesColumnsBlock({ block }: RulesColumnsBlockProps) {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                {block.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">{block.heading}</h2>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                    {block.allowed_column && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircleIcon
                                    className="w-5 h-5 text-emerald-500"
                                    weight="duotone"
                                />
                                <h3 className="font-bold text-lg">
                                    {block.allowed_column.heading ?? 'Allowed'}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {block.allowed_column.rules.map((rule, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm"
                                    >
                                        <CheckCircleIcon
                                            className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"
                                            weight="fill"
                                        />
                                        <span>{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {block.disallowed_column && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <XCircleIcon
                                    className="w-5 h-5 text-red-500"
                                    weight="duotone"
                                />
                                <h3 className="font-bold text-lg">
                                    {block.disallowed_column.heading ?? 'Not Allowed'}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {block.disallowed_column.rules.map((rule, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm"
                                    >
                                        <XCircleIcon
                                            className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                                            weight="fill"
                                        />
                                        <span>{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
