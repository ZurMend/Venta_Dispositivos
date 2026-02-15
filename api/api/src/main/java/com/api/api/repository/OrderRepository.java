package com.api.api.repository;

import com.api.api.model.Order; // Importante para que reconozca la entidad Order
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para la gestión de Órdenes.
 * Extiende de JpaRepository para obtener metodos como save(), findAll(), deleteById(), etc.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Este método te servirá para el endpoint GET /api/orders/user/{userId}
    List<Order> findByUserId(Long userId);
}