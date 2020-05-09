package com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientJpaRepository extends JpaRepository<Ingredient,Long> {
	Ingredient findByNameAndAmount(String name,Long amount);
}
