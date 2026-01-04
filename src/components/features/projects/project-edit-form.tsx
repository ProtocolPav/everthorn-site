// components/features/projects/project-edit-form.tsx
import { useState } from 'react';
import { Project } from '@/types/projects';
import { useUpdateProject } from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SeamlessInput } from '@/components/ui/custom/seamless-input';
import { SeamlessSelect } from '@/components/ui/custom/seamless-select';
import { Separator } from '@/components/ui/separator';
import {
    CheckIcon,
    SpinnerGapIcon,
    MapPinIcon,
    PushPinIcon,
    UserIcon,
    HashIcon,
    ClockIcon
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { STATUS_OPTIONS, DIMENSION_OPTIONS } from '@/config/project-form-options.ts'

interface ProjectEditFormProps {
    project: Project;
    onSuccess?: () => void;
}

export function ProjectEditForm({ project, onSuccess }: ProjectEditFormProps) {
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description,
        status: project.status,
        coordinates: project.coordinates.join(', '),
        dimension: project.dimension,
        owner_id: String(project.owner_id),
        pin_id: project.pin_id ? String(project.pin_id) : '',
    });

    const updateProject = useUpdateProject();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Record<string, any> = {};

        if (formData.name !== project.name) payload.name = formData.name;
        if (formData.description !== project.description) payload.description = formData.description;
        if (formData.status !== project.status) payload.status = formData.status;
        if (formData.dimension !== project.dimension) payload.dimension = formData.dimension;
        if (Number(formData.owner_id) !== project.owner_id) payload.owner_id = Number(formData.owner_id);

        const newPinId = formData.pin_id ? Number(formData.pin_id) : null;
        if (newPinId !== project.pin_id) payload.pin_id = newPinId;

        if (formData.coordinates !== project.coordinates.join(', ')) {
            const coords = formData.coordinates.split(',').map(c => parseFloat(c.trim()));
            if (coords.length === 3 && coords.every(c => !isNaN(c))) payload.coordinates = coords;
        }

        if (Object.keys(payload).length === 0) return;

        updateProject.mutate(
            { projectId: project.project_id, payload },
            { onSuccess: () => onSuccess?.() }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-background/50">

            {/* --- 1. HEADER SECTION --- */}
            <div className="flex flex-col gap-6 p-6 pb-4 shrink-0">
                <div className="flex flex-col-reverse gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                    {/* Main Title */}
                    <Field className="flex-1 min-w-0">
                        <FieldLabel className="sr-only">Project Name</FieldLabel>
                        <SeamlessInput
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground px-0 -ml-2 py-2 w-full break-words"
                            placeholder="Project Name"
                        />
                    </Field>

                    {/* Status Badge */}
                    {/* Mobile: Self-start to align left. Desktop: Self-center/auto to sit nicely */}
                    <Field className="w-fit self-start lg:self-center shrink-0">
                        <FieldLabel className="sr-only">Status</FieldLabel>
                        <SeamlessSelect
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                            options={STATUS_OPTIONS}
                        />
                    </Field>
                </div>

                {/* Header Metadata */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground/80">
                    <div className="flex items-center gap-2">
                        <UserIcon weight="fill" className="text-primary/40" />
                        <span className="text-foreground/90 font-medium">{project.owner.username}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                        <ClockIcon weight="fill" className="text-primary/40" />
                        <span>{project.started_on ? format(new Date(project.started_on), 'MMM d, yyyy') : 'No Date'}</span>
                    </div>
                </div>
            </div>

            <Separator className="mx-6 w-auto opacity-50 shrink-0" />

            {/* --- 2. MAIN CONTENT (Responsive Split) --- */}
            {/* Mobile: Single scroll container. Desktop: Flex row with independent scroll containers */}
            <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto lg:overflow-y-hidden relative">

                {/* LEFT: Description */}
                <div className="flex-1 p-6 lg:overflow-y-auto h-auto lg:h-full">
                    <Field className="space-y-1">
                        <FieldLabel className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">
                            About this project
                        </FieldLabel>
                        <SeamlessInput
                            as="textarea"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add a detailed description..."
                            className="text-base leading-7 min-h-fit text-foreground/80 ml-0 px-3 py-2"
                        />
                    </Field>
                </div>

                <Separator className="lg:hidden w-full opacity-50" />

                {/* RIGHT: Properties Panel */}
                <div className="
                    lg:w-[320px] lg:h-full lg:border-l lg:border-border/40 lg:overflow-y-auto
                    w-full h-auto bg-muted/10 p-6 space-y-8
                ">
                    {/* Location Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <MapPinIcon className="w-4 h-4 text-primary" />
                            <span>Location</span>
                        </div>

                        <div className="space-y-4 pl-1">
                            <Field className="space-y-1.5">
                                <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground/70">
                                    Dimension
                                </FieldLabel>
                                <SeamlessSelect
                                    value={formData.dimension}
                                    onValueChange={(val) => setFormData({ ...formData, dimension: val })}
                                    options={DIMENSION_OPTIONS}
                                    className="w-full justify-start h-8"
                                />
                            </Field>

                            <Field className="space-y-1.5">
                                <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground/70">
                                    Coordinates
                                </FieldLabel>
                                <div className="relative group">
                                    <HashIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        value={formData.coordinates}
                                        onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                                        className="pl-8 h-8 font-mono text-xs bg-background/50 border-border/50 focus:bg-background transition-colors"
                                        placeholder="X, Y, Z"
                                    />
                                </div>
                            </Field>

                            <Field className="space-y-1.5">
                                <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground/70">
                                    Map Pin ID
                                </FieldLabel>
                                <div className="relative group">
                                    <PushPinIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="number"
                                        value={formData.pin_id}
                                        onChange={(e) => setFormData({ ...formData, pin_id: e.target.value })}
                                        className="pl-8 h-8 font-mono text-xs bg-background/50 border-border/50 focus:bg-background transition-colors"
                                        placeholder="Unlinked"
                                    />
                                </div>
                            </Field>
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Admin Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span>Administration</span>
                        </div>

                        <div className="space-y-4 pl-1">
                            <Field className="space-y-1.5">
                                <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground/70">
                                    Owner
                                </FieldLabel>
                                <Select
                                    value={formData.owner_id}
                                    onValueChange={(val) => setFormData({ ...formData, owner_id: val })}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-background/50 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={String(project.owner_id)}>
                                            {project.owner.username}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </div>
                    {/* Extra padding for mobile scroll */}
                    <div className="h-4 lg:hidden" />
                </div>
            </div>

            {/* --- 3. FOOTER --- */}
            <div className="p-4 border-t bg-background/95 flex justify-between items-center shrink-0">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => updateProject.reset()}
                    className="text-muted-foreground hover:text-destructive transition-colors text-xs"
                >
                    Discard Changes
                </Button>

                <Button
                    type="submit"
                    disabled={updateProject.isPending}
                    className={cn(
                        "min-w-[120px] transition-all",
                        updateProject.isSuccess && "bg-green-600 hover:bg-green-700"
                    )}
                >
                    {updateProject.isPending ? (
                        <SpinnerGapIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : updateProject.isSuccess ? (
                        <>
                            <CheckIcon className="mr-2 h-4 w-4" />
                            Saved
                        </>
                    ) : (
                        "Save Project"
                    )}
                </Button>
            </div>
        </form>
    );
}
