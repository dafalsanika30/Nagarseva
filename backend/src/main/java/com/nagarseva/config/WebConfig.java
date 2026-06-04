package com.nagarseva.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig
        implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        registry

                .addResourceHandler(
                        "/uploads/**"
                )

                .addResourceLocations(

                        "file:///F:/MCA/SY-MCAVI/Project/Backend/nagarseva/uploads/"

                );
    }
}