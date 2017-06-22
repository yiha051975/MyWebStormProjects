package com.sheldon.rest.dao;

import com.sheldon.rest.common.domain.Product;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.List;

/**
 * Created by Sheld on 5/29/2017.
 */
public class ProductDAO {
    @PersistenceContext(unitName = "coffee_shop_persistence_unit")
    private EntityManager em;

    public List<Product> getAllProducts() {
        TypedQuery<Product> prod = em.createNamedQuery("products.getAllProducts", Product.class);
        return prod.getResultList();
    }

    public Product getProduct(String sku) {
        TypedQuery<Product> typedQuery = em.createNamedQuery("products.getProductBySku", Product.class).setParameter("sku", sku);
        return typedQuery.getSingleResult();
    }

    public Product addProduct(Product product) {
        em.persist(product);
        return product;
    }

    public Product removeProduct(Product product) {
        Product tempProduct = getProduct(product.getSku());
        em.remove(tempProduct);
        return tempProduct;
    }

    public boolean removeProduct(String sku) {
        Query query = em.createNamedQuery("products.deleteProductBySku").setParameter("sku", sku);
        int status = query.executeUpdate();
        return status == 1;
    }
}
