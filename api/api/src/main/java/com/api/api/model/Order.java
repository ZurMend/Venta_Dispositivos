package com.api.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders") // Mapea a la tabla 'orders' de tu SQL
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id") // Mapea exactamente a la columna 'user_id'
    private Long userId;

    private Double total;

    @Enumerated(EnumType.STRING) // Para que guarde 'pending', 'confirmed', etc. como texto
    private Status status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relación con los items. El cascade permite guardar los items automáticamente al guardar la orden.
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id") // Llave foránea en la tabla order_items
    private List<OrderItem> items;

    public enum Status {
        pending, confirmed, shipped, delivered
    }
}