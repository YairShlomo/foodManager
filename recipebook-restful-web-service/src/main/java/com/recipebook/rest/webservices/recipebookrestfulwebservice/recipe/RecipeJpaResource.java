package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class RecipeJpaResource {
	@Autowired
	private RecipeJpaRepository recipeJpaRepository;
	
	@GetMapping("/jpa/recipes/all") 
	public List<Recipe> getAllRecipes() {
		return recipeJpaRepository.findAll();
	}
}
