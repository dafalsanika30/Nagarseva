package com.nagarseva.enums;

import lombok.Getter;

@Getter
public enum DepartmentType {

    WATER_SUPPLY(
            "Water Supply", "bi-droplet-fill",
            "#0ea5e9", "#e0f2fe", 48
    ),
    ROADS_TRANSPORT(
            "Roads & Transport", "bi-cone-striped",
            "#f59e0b", "#fef3c7", 72
    ),
    SANITATION(
            "Sanitation & Waste", "bi-trash3-fill",
            "#10b981", "#d1fae5", 24
    ),
    STREET_LIGHTING(
            "Street Lighting", "bi-lightbulb-fill",
            "#f97316", "#ffedd5", 48
    ),
    PARKS_GARDENS(
            "Parks & Gardens", "bi-tree-fill",
            "#22c55e", "#dcfce7", 96
    ),
    BUILDING_CONSTRUCTION(
            "Building & Construction", "bi-building-fill",
            "#8b5cf6", "#ede9fe", 168
    ),
    HEALTH_SERVICES(
            "Health Services", "bi-heart-pulse-fill",
            "#ef4444", "#fee2e2", 24
    ),
    FIRE_SERVICES(
            "Fire Services", "bi-fire",
            "#dc2626", "#fef2f2", 2
    );

    private final String displayName;
    private final String iconClass;
    private final String color;
    private final String bgColor;
    private final int    defaultSlaHours;

    DepartmentType(String displayName, String iconClass,
                   String color, String bgColor,
                   int defaultSlaHours) {
        this.displayName     = displayName;
        this.iconClass       = iconClass;
        this.color           = color;
        this.bgColor         = bgColor;
        this.defaultSlaHours = defaultSlaHours;
    }
}