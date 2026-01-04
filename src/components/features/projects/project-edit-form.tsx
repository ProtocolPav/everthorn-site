// components/features/projects/project-edit-form.tsx
import { useState } from 'react';
import { Project } from '@/types/projects';
import { useUpdateProject } from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SeamlessInput } from '@/components/ui/custom/seamless-input';
import { SeamlessSelect, SeamlessSelectOption } from '@/components/ui/custom/seamless-select';
import { Separator } from '@/components/ui/separator';
import {
    CheckIcon,
    SpinnerGapIcon,
    CheckCircleIcon,
    XCircleIcon,
    PauseCircleIcon,
    GlobeIcon,
    FireIcon,
    PlanetIcon,
    PushPinIcon,
    MapPinIcon,
    CalendarIcon,
    UserIcon,
    HashIcon
} from '@phosphor-icons/react';
import { format } from 'date-fns';

// --- Configuration Options ---
const STATUS_OPTIONS: SeamlessSelectOption[] = [
    {
        value: 'ongoing', label: 'Ongoing', icon: SpinnerGapIcon,
        triggerClassName: "bg-pink-500/10 border-pink-500/20 text-pink-600 hover:bg-pink-500/20",
        iconClassName: "text-pink-600 animate-spin-slow"
    },
    {
        value: 'completed', label: 'Completed', icon: CheckCircleIcon,
        triggerClassName: "bg-orange-500/10 border-orange-500/20 text-orange-600 hover:bg-orange-500/20",
        iconClassName: "text-orange-600"
    },
    {
        value: 'abandoned', label: 'Abandoned', icon: XCircleIcon,
        triggerClassName: "bg-slate-500/10 border-slate-500/20 text-slate-500 hover:bg-slate-500/20",
        iconClassName: "text-slate-500"
    },
    {
        value: 'pending', label: 'Pending', icon: PauseCircleIcon,
        triggerClassName: "bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20",
        iconClassName: "text-blue-600"
    }
];

const DIMENSION_OPTIONS: SeamlessSelectOption[] = [
    { value: 'overworld', label: 'Overworld', icon: GlobeIcon, triggerClassName: "text-green-600 bg-green-500/10 border-green-200" },
    { value: 'nether', label: 'Nether', icon: FireIcon, triggerClassName: "text-red-600 bg-red-500/10 border-red-200" },
    { value: 'end', label: 'The End', icon: PlanetIcon, triggerClassName: "text-purple-600 bg-purple-500/10 border-purple-200" }
];

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
        started_on: project.started_on?.split('T')[0] || '',
        completed_on: project.completed_on?.split('T')[0] || '',
    });

    const updateProject = useUpdateProject();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ... (Same submission logic as before) ...
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
        if (formData.started_on !== project.started_on?.split('T')[0]) payload.started_on = formData.started_on;
        if (formData.completed_on !== (project.completed_on?.split('T')[0] || '')) payload.completed_on = formData.completed_on || null;

        if (Object.keys(payload).length === 0) return;

        updateProject.mutate(
            { projectId: project.project_id, payload },
            { onSuccess: () => onSuccess?.() }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-background">

            {/* --- 1. HEADER SECTION --- */}
            <div className="px-6 pt-6 pb-2 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Big Title Input */}
                    <div className="flex-1 min-w-0">
                        <SeamlessInput
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="text-3xl font-bold tracking-tight px-0 border-0 focus-visible:ring-0 focus-visible:bg-muted/50 -ml-2 w-full h-auto py-1 text-foreground"
                            placeholder="Project Name"
                        />
                        {/* Sub-header Metadata */}
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <UserIcon className="w-4 h-4" />
                                <span>{project.owner.username}</span>
                            </div>
                            <Separator orientation="vertical" className="h-3" />
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Started {project.started_on ? format(new Date(project.started_on), 'MMM d, yyyy') : 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Status Badge */}
                    <div className="flex-shrink-0">
                        <SeamlessSelect
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">

                {/* Description (The "Document" feel) */}
                <div className="group">
                    <SeamlessInput
                        as="textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add a detailed description about this project..."
                        className="text-base leading-relaxed min-h-[120px] px-0 -ml-2 resize-none text-muted-foreground/80 focus:text-foreground transition-colors"
                    />
                </div>

                {/* Technical Details Card (The "Admin" Panel) */}
                <div className="rounded-xl border bg-muted/30 p-5 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                        <HashIcon className="w-4 h-4" />
                        <span>Project Properties</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Dimension */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground pl-1">Dimension</label>
                            <SeamlessSelect
                                value={formData.dimension}
                                onValueChange={(val) => setFormData({ ...formData, dimension: val })}
                                options={DIMENSION_OPTIONS}
                                className="w-full justify-start h-9 bg-background border shadow-sm"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground pl-1">Location (XYZ)</label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.coordinates}
                                    onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                                    className="pl-9 font-mono text-sm bg-background border-border/60"
                                />
                            </div>
                        </div>

                        {/* Pin ID */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground pl-1">Map Pin ID</label>
                            <div className="relative">
                                <PushPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    value={formData.pin_id}
                                    onChange={(e) => setFormData({ ...formData, pin_id: e.target.value })}
                                    className="pl-9 bg-background border-border/60"
                                    placeholder="Not linked"
                                />
                            </div>
                        </div>

                        {/* Owner Transfer */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground pl-1">Owner</label>
                            <Select
                                value={formData.owner_id}
                                onValueChange={(val) => setFormData({ ...formData, owner_id: val })}
                            >
                                <SelectTrigger className="bg-background border-border/60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={String(project.owner_id)}>
                                        {project.owner.username}
                                    </SelectItem>
                                    {/* Additional users would map here */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. FOOTER ACTIONS --- */}
            <div className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-end gap-3">
                {/* Only show Reset if dirty? (Optional logic) */}
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => updateProject.reset()}
                    disabled={updateProject.isPending}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Discard
                </Button>
                <Button
                    type="submit"
                    disabled={updateProject.isPending}
                    className="min-w-[100px]"
                >
                    {updateProject.isPending ? (
                        <SpinnerGapIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckIcon className="mr-2 h-4 w-4" />
                    )}
                    Save
                </Button>
            </div>
        </form>
    );
}
