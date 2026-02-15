package com.api.api.controller;

import com.api.api.model.*;
import com.api.api.repository.*;
import com.api.api.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // IMPORTANTE: Para que tu React pueda conectarse

public class ApiController {

    @Autowired private ProductRepository productRepo;
    @Autowired private OrderRepository orderRepo;

    // --- PRODUCTOS ---
    @GetMapping("/products")
    public List<Product> getProducts() { return productRepo.findAll(); }

    @GetMapping("/products/category/{cat}")
    public List<Product> getByCat(@PathVariable String cat) { return productRepo.findByCategory(cat); }

    @PostMapping("/products")
    public Product create(@RequestBody Product p) { return productRepo.save(p); }

    @PutMapping("/products/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        p.setId(id);
        return productRepo.save(p);
    }

    @DeleteMapping("/products/{id}")
    public void delete(@PathVariable Long id) { productRepo.deleteById(id); }

    // --- ORDENES ---
    @PostMapping("/orders")
    public Order createOrder(@RequestBody Order order) { return orderRepo.save(order); }

    @GetMapping("/orders")
    public List<Order> getOrders() { return orderRepo.findAll(); }
}