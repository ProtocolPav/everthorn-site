import {Icon} from "@phosphor-icons/react";
import React from "react";

export interface Toggle {
    id: string;
    icon?: Icon;
    image?: React.ReactNode;
    name: string;
    visible: boolean;
    label_visible?: boolean;
    description?: string;
}