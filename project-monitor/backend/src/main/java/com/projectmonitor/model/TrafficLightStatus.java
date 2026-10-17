package com.projectmonitor.model;

public enum TrafficLightStatus {
    GREEN,   // average >= 7
    YELLOW,  // 4 <= average < 7
    RED;     // average < 4

    public static TrafficLightStatus fromAverage(Double average) {
        if (average == null) return RED;
        if (average >= 7.0) return GREEN;
        if (average >= 4.0) return YELLOW;
        return RED;
    }
}
