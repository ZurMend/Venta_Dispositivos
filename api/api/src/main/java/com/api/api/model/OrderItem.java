package com.api.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items") // Mapea a la tabla 'order_items' de tu SQL
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id") // Mapea a la columna 'product_id'
    private Long productId;

    @Column(name = "product_name") // Mapea a la columna 'product_name'
    private String productName;

    private Integer quantity;

    private Double price;
}