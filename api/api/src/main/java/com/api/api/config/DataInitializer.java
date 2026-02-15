package com.api.api.config;

import com.api.api.model.Product;
import com.api.api.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            Product p1 = new Product();
            p1.setName("iPhone 15 Pro");
            p1.setBrand("Apple");
            p1.setPrice(999.99);
            p1.setCategory("electronics");
            p1.setStock(10);
            p1.setImage("/images/iphone.jpg");
            repository.save(p1);

            System.out.println("Base de datos inicializada con productos de prueba");
        };
    }
}