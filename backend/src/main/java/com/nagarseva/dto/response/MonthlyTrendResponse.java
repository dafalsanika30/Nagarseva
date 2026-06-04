// dto/response/MonthlyTrendResponse.java
// Interface projection — Spring maps SQL result to this
package com.nagarseva.dto.response;

public interface MonthlyTrendResponse {

    String getMonth();

    Long getTotal();

    Long getResolved();

    Long getOpen();
}