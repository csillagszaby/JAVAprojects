package com.example.disi.DTOs;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TariffDto {
    private Long id;
    private Integer dayTariff;
    private Integer nightTariff;
}
