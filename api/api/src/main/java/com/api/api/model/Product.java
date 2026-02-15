package com.api.api.model; // Ajusta el nombre según tu proyecto

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data // Genera Getters y Setters automáticamente
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String category; 
    private String image;
    private Integer stock;
    private String brand;
}