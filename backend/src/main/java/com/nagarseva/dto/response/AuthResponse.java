// dto/response/AuthResponse.java
package com.nagarseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private Long   id;
    private String name;
    private String email;
    private String role;   // CITIZEN, OFFICER, ADMIN
}