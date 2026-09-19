package com.victor.timetrack.dto;

import com.victor.timetrack.dto.request.CreateTimeEntryRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

class ValidationMessagesTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    @Test
    void constraintMessagesComeFromTheApplicationBundle() {
        CreateTimeEntryRequest request = new CreateTimeEntryRequest();
        request.setProjectId(null);
        request.setDate(LocalDate.of(2026, 9, 19));
        request.setHours(new BigDecimal("30.123"));
        request.setDescription("   ");

        assertThat(messagesByField(request))
                .containsEntry("projectId", "This field is required")
                .containsEntry("description", "Must not be blank")
                .containsKey("hours");
        assertThat(messagesFor(request, "hours"))
                .contains("Must be at most 24", "Must have at most 2 whole digits and 2 decimal places");
    }

    @Test
    void sizeWithOnlyAMaximumNamesTheMaximum() {
        CreateTimeEntryRequest request = new CreateTimeEntryRequest();
        request.setProjectId(1L);
        request.setDate(LocalDate.of(2026, 9, 19));
        request.setHours(new BigDecimal("2"));
        request.setDescription("x".repeat(256));

        assertThat(messagesByField(request)).containsEntry("description", "Must be at most 255 characters");
    }

    private Map<String, String> messagesByField(Object request) {
        return validator.validate(request).stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (first, second) -> first));
    }

    private List<String> messagesFor(Object request, String field) {
        return validator.validate(request).stream()
                .filter(violation -> violation.getPropertyPath().toString().equals(field))
                .map(ConstraintViolation::getMessage)
                .toList();
    }
}
