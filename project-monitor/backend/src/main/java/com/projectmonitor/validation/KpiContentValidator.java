package com.projectmonitor.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Map;

public class KpiContentValidator implements ConstraintValidator<ValidKpiContent, Map<Integer, String>> {

    @Override
    public boolean isValid(Map<Integer, String> value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        if (value.size() != 10) {
            return false;
        }
        for (int i = 1; i <= 10; i++) {
            String desc = value.get(i);
            if (desc == null || desc.isBlank()) {
                return false;
            }
        }
        return true;
    }
}
