package com.nagarseva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling           // needed for SLA scheduler
@EnableAsync
public class NagarSevaApplication {
	public static void main(String[] args) {
		BCryptPasswordEncoder encoder =
				new BCryptPasswordEncoder();


		// System.out.println("Admin Password: " + encoder.encode("admin123"));
		// System.out.println("Water Password: " + encoder.encode("water123"));
		// System.out.println("Roads Password: " + encoder.encode("roads123"));
		// System.out.println("Sanitation Password: " + encoder.encode("sanit123"));
		// System.out.println("Lighting Password: " + encoder.encode("light123"));
		// System.out.println("Parks Password: " + encoder.encode("parks123"));
		// System.out.println("Building Password: " + encoder.encode("build123"));
		// System.out.println("Health Password: " + encoder.encode("health123"));
		// System.out.println("Fire Password: " + encoder.encode("fire123"));

		SpringApplication.run(NagarSevaApplication.class, args);

	}
}