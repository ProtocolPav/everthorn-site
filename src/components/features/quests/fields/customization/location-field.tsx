import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { LocationCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "../../../../../config/objective-customization-options.ts";

export function LocationField() {
    const field = useFieldContext<LocationCustomization>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const coords = field.state.value?.coordinates;
    const h = field.state.value?.horizontal_radius ?? '?';
    const v = field.state.value?.vertical_radius ?? '?';
    const hint =
        "X:" + (coords?.[0] ?? '?') +
        " Y:" + (coords?.[1] ?? '?') +
        " Z:" + (coords?.[2] ?? '?') +
        " (H:" + h + ", V:" + v + ")";

    function handleCoordChange(coordIndex: 0 | 1 | 2, rawValue: string) {
        const newCoords = [...(field.state.value?.coordinates || [0, 0, 0])];
        newCoords[coordIndex] = rawValue === '' ? (undefined as any) : parseFloat(rawValue);
        field.handleChange({ ...field.state.value, coordinates: newCoords as [number, number, number] });
    }

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Location</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.location.display}
                icon={CUSTOMIZATIONS.location.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center flex-wrap gap-2 text-base">
                            <span>Player must be within</span>
                            <Input
                                type="number"
                                step="any"
                                className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                                data-invalid={isInvalid}
                                aria-invalid={isInvalid}
                                value={field.state.value?.horizontal_radius ?? ''}
                                onChange={(e) => field.handleChange({ ...field.state.value, horizontal_radius: e.target.value === '' ? (undefined as any) : parseFloat(e.target.value) })}
                            />
                            <span>blocks horizontally and</span>
                            <Input
                                type="number"
                                step="any"
                                className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                                data-invalid={isInvalid}
                                aria-invalid={isInvalid}
                                value={field.state.value?.vertical_radius ?? ''}
                                onChange={(e) => field.handleChange({ ...field.state.value, vertical_radius: e.target.value === '' ? (undefined as any) : parseFloat(e.target.value) })}
                            />
                            <span>blocks vertically</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-2 text-base">
                            <span>of the coordinates X:</span>
                            <Input
                                type="number"
                                step="any"
                                className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                                data-invalid={isInvalid}
                                aria-invalid={isInvalid}
                                value={field.state.value?.coordinates?.[0] ?? ''}
                                onChange={(e) => handleCoordChange(0, e.target.value)}
                            />
                            <span>Y:</span>
                            <Input
                                type="number"
                                step="any"
                                className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                                data-invalid={isInvalid}
                                aria-invalid={isInvalid}
                                value={field.state.value?.coordinates?.[1] ?? ''}
                                onChange={(e) => handleCoordChange(1, e.target.value)}
                            />
                            <span>Z:</span>
                            <Input
                                type="number"
                                step="any"
                                className="w-16 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                                data-invalid={isInvalid}
                                aria-invalid={isInvalid}
                                value={field.state.value?.coordinates?.[2] ?? ''}
                                onChange={(e) => handleCoordChange(2, e.target.value)}
                            />
                        </div>
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
