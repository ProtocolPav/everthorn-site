import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepType } from "@/types/application-step";
import { FormApi } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-form";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface FieldRendererProps {
    step: StepType;
    // @ts-ignore
    form: FormApi;
}

export function FieldRenderer({ step, form }: FieldRendererProps) {
    if (!step.field) return null;

    // @ts-ignore
    const fieldValue = useStore(form.store, (state) => state.values[step.field!]);

    return (
        <>
            <form.Field
                name={step.field}
                // @ts-ignore
                children={(field) => {
                    const isInvalid = field.state.meta.errors.length > 0;
                    const hasValue = field.state.value && String(field.state.value).length > 0;
                    const isValid = field.state.meta.isValid && hasValue;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2.5"
                        >
                            {/* Description at top for better UX */}
                            {step.description && (
                                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            )}

                            <Field data-invalid={isInvalid}>
                                <div className="relative w-full">
                                    {step.type === 'textarea' && (
                                        <div className="relative w-full">
                                            <Textarea
                                                placeholder={step.placeholder}
                                                className="w-full min-h-24 resize-none text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                maxLength={step.maxLength || 500}
                                                value={field.state.value ?? ''}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                aria-invalid={isInvalid}
                                            />
                                            {/* Character counter */}
                                            {step.maxLength && hasValue && (
                                                <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/70 font-mono">
                                                    {String(field.state.value).length}/{step.maxLength}
                                                </div>
                                            )}
                                            {/* Success indicator */}
                                            {isValid && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                    className="absolute top-2 right-2 bg-green-500 rounded-full p-0.5"
                                                >
                                                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {step.type === 'number' && (
                                        <div className="relative w-full">
                                            <Input
                                                type="number"
                                                placeholder={step.placeholder}
                                                className="w-full text-center text-xl h-14 font-semibold transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                value={field.state.value ?? ''}
                                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                                onBlur={field.handleBlur}
                                                aria-invalid={isInvalid}
                                            />
                                            {isValid && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                    className="absolute top-1/2 -translate-y-1/2 right-3 bg-green-500 rounded-full p-0.5"
                                                >
                                                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {step.type === 'select' && (
                                        <div className="relative w-full">
                                            <Select
                                                value={field.state.value}
                                                onValueChange={field.handleChange}
                                            >
                                                <SelectTrigger
                                                    className="w-full h-12 text-sm text-center transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    aria-invalid={isInvalid}
                                                >
                                                    <SelectValue
                                                        placeholder={step.placeholder}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="w-full max-h-[280px]"
                                                    position="popper"
                                                    sideOffset={4}
                                                >
                                                    {step.options?.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            className="text-sm py-2.5 cursor-pointer text-center"
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isValid && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                    className="absolute top-1/2 -translate-y-1/2 right-10 bg-green-500 rounded-full p-0.5 pointer-events-none"
                                                >
                                                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Error message */}
                                {isInvalid && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-xs text-destructive text-center"
                                    >
                                        <FieldError errors={field.state.meta.errors} />
                                    </motion.div>
                                )}
                            </Field>
                        </motion.div>
                    );
                }}
            />

            {/* Follow-up field */}
            {step.followUp && step.followUp.showWhen?.includes(fieldValue) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 overflow-hidden"
                >
                    <form.Field
                        name={step.followUp.field}
                        // @ts-ignore
                        children={(field) => {
                            const isInvalid = field.state.meta.errors.length > 0;
                            const hasValue = field.state.value && String(field.state.value).length > 0;
                            const placeholder = typeof step.followUp!.placeholder === 'function'
                                ? step.followUp!.placeholder(fieldValue)
                                : step.followUp!.placeholder;
                            const description = typeof step.followUp!.description === 'function'
                                ? step.followUp!.description(fieldValue)
                                : step.followUp!.description;

                            return (
                                <Field data-invalid={isInvalid} className="space-y-2.5">
                                    {/* Description */}
                                    {description && (
                                        <p className="text-xs text-center text-muted-foreground leading-relaxed">
                                            {description}
                                        </p>
                                    )}

                                    <div className="relative w-full">
                                        <Textarea
                                            placeholder={placeholder}
                                            className="w-full min-h-20 resize-none text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            maxLength={step.followUp!.maxLength || 200}
                                            value={field.state.value ?? ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            aria-invalid={isInvalid}
                                        />
                                        {step.followUp!.maxLength && hasValue && (
                                            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/70 font-mono">
                                                {String(field.state.value).length}/{step.followUp!.maxLength}
                                            </div>
                                        )}
                                    </div>

                                    {isInvalid && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="text-xs text-destructive text-center"
                                        >
                                            <FieldError errors={field.state.meta.errors} />
                                        </motion.div>
                                    )}
                                </Field>
                            );
                        }}
                    />
                </motion.div>
            )}
        </>
    );
}
