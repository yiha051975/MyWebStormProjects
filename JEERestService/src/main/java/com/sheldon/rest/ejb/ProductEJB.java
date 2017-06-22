package com.sheldon.rest.ejb;

import com.sheldon.rest.common.domain.Product;
import com.sheldon.rest.dao.ProductDAO;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by Sheld on 5/26/2017.
 */
@Stateless
public class ProductEJB {
    @Inject
    private ProductDAO productDAO;

    public List<Product> getAllProducts() {
        return productDAO.getAllProducts();
    }

    public Product getProduct(String sku) {
        return productDAO.getProduct(sku);
    }

    @Transactional
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public Product addProduct(Product product) {
        return productDAO.addProduct(product);
    }

    @Transactional
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public Product removeProduct(Product product) {
        return productDAO.removeProduct(product);
    }

    @Transactional
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public boolean removeProduct(String sku) {
        return productDAO.removeProduct(sku);
    }
}
