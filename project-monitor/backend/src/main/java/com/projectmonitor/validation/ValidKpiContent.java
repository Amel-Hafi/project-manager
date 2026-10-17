package com.projectmonitor.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = KpiContentValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidKpiContent {
    String message() default "Content must contain exactly keys 1 through 10, all with non-blank values";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
