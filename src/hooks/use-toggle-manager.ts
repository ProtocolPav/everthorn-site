import React from "react";
import type { Toggle } from "@/types/map-toggle";
import { DEFAULT_PINS, DEFAULT_LAYERS } from "@/config/map-defaults.ts";

export function useToggleManager() {
    // Load initial state from localStorage or use defaults for pins
    const [pintoggles, setpintoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_PINS;

        try {
            const saved = localStorage.getItem('everthorn-map-pins');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new pins added in updates
                return DEFAULT_PINS.map(defaultPin => {
                    const savedPin = parsed.find((p: Toggle) => p.id === defaultPin.id);
                    return savedPin ? { ...defaultPin, ...savedPin } : defaultPin;
                });
            }
        } catch (error) {
            console.error('Failed to load pin preferences:', error);
        }

        return DEFAULT_PINS;
    });

    // Load initial state from localStorage or use defaults for layers
    const [layertoggles, setlayertoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_LAYERS;

        try {
            const saved = localStorage.getItem('everthorn-map-layers');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new layers added in updates
                return DEFAULT_LAYERS.map(defaultLayer => {
                    const savedLayer = parsed.find((l: Toggle) => l.id === defaultLayer.id);
                    return savedLayer ? { ...defaultLayer, ...savedLayer } : defaultLayer;
                });
            }
        } catch (error) {
            console.error('Failed to load layer preferences:', error);
        }

        return DEFAULT_LAYERS;
    });

    // Save pins to localStorage whenever they change
    React.useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-pins', JSON.stringify(pintoggles));
        } catch (error) {
            console.error('Failed to save pin preferences:', error);
        }
    }, [pintoggles]);

    // Save layers to localStorage whenever they change
    React.useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-layers', JSON.stringify(layertoggles));
        } catch (error) {
            console.error('Failed to save layer preferences:', error);
        }
    }, [layertoggles]);

    function update_pins(id: string, toggle_label?: boolean) {
        const new_pins = pintoggles.map((pin) => {
            if (pin.id === id) {
                return {
                    ...pin,
                    visible: toggle_label ? pin.visible : !pin.visible,
                    label_visible: toggle_label ? !pin.label_visible : pin.label_visible,
                };
            } else {
                return pin;
            }
        });

        setpintoggles(new_pins);
    }

    function update_layers(id: string) {
        const new_layers = layertoggles.map((layer) => {
            if (layer.id === id) {
                return {
                    ...layer,
                    visible: true,
                };
            } else {
                return {
                    ...layer,
                    visible: false,
                };
            }
        });

        setlayertoggles(new_layers);
    }

    return {
        pintoggles,
        layertoggles,
        update_pins,
        update_layers,
    };
}