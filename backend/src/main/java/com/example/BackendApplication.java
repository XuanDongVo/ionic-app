package com.example;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.cloudinary.Cloudinary;

@SpringBootApplication
public class BackendApplication {

	@Value("${cloudinary.cloud_name:}")
	private String cloudName;

	@Value("${cloudinary.api_key:}")
	private String apiKey;

	@Value("${cloudinary.api_secret:}")
	private String apiSecret;

	@Bean
	public Cloudinary cloudinary() {
		System.out.println("Creating Cloudinary bean with cloud_name: " + cloudName);
		Map<String, String> config = new HashMap<>();
		config.put("cloud_name", cloudName);
		config.put("api_key", apiKey);
		config.put("api_secret", apiSecret);
		return new Cloudinary(config);
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
