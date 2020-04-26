package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@GetMapping("/jpa/users/{mailOwner}/recipes") 
	public List<Recipe> getRecipesByMail(@PathVariable String mailOwner) {
		return recipeJpaRepository.findByMailOwner(mailOwner);
	}
	
	@PutMapping("/jpa/users/{mailOwner}/recipes")
	public ResponseEntity<Recipe[]> updateRecipes(
			@PathVariable String mailOwner, @RequestBody Recipe[] recipes) {
		List<Recipe> recipesList = new ArrayList<Recipe>();
		for(int i=0;i<recipes.length;i++) {
			Recipe recipe = recipes[i];
			recipesList.add(recipe);
			//recipeJpaRepository.deleteById(recipe.getId());
		}
		List<Recipe> updatedRecipes = recipeJpaRepository.saveAll(recipesList);
		Recipe[] recipesArray = {};
		recipesArray = updatedRecipes.toArray(recipesArray);
		return new ResponseEntity<Recipe[]>(recipesArray, HttpStatus.OK);
	}
	

	
	
	
	/*
	@PutMapping("/jpa/users/{mailOwner}/recipe")
	public ResponseEntity<Recipe> updateRecipe(
			@PathVariable String mailOwner,@RequestBody Recipe recipe) {
		Long id = recipe.getId();
		Recipe updatedRecipe;
		if (id!=-1) {
			Recipe recipeObj = new Recipe(id, recipe.getMailOwner(), recipe.getName(), recipe.getDescription(), recipe.getImagePath(),recipe.getIngredients());
			updatedRecipe = recipeJpaRepository.save(recipeObj);
		} else {
			updatedRecipe = recipeJpaRepository.save(recipe);
		}
		//recipeJpaRepository.deleteById(id);
		return new ResponseEntity<Recipe>(updatedRecipe, HttpStatus.OK);
	}
	*/
}
