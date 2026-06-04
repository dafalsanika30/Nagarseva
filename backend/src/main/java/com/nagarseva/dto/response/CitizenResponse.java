// dto/response/CitizenResponse.java
package com.nagarseva.dto.response;

import com.nagarseva.entity.Citizen;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CitizenResponse {

    private Long    id;
    private String  name;
    private String  email;
    private String  mobile;
    private String  address;
    private String  role;
    private boolean active;
    private String  createdAt;
    // NO password field — never expose it

    public static CitizenResponse from(Citizen c) {
        return CitizenResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .mobile(c.getMobile())
                .address(c.getAddress())
                .role(c.getRole().name())
                .active(c.isActive())
                .createdAt(c.getCreatedAt().toString())
                .build();
    }
}