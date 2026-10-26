package com.zumply.healthservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorListDTO {
    private Long doctorId;
    private String doctorName;
    private String hospitalName;
    private int rating;
    private String registrationNo;
    private BigDecimal fees;
}
