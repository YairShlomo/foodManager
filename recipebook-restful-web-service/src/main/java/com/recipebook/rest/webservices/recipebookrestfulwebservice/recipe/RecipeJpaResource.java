package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Ingredient;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.IngredientJpaRepository;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource.UserDetailsJpaRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class RecipeJpaResource {
	@Autowired
	private RecipeJpaRepository recipeJpaRepository;

	@Autowired
	private UserDetailsJpaRepository userDetailsJpaRepository;

	@Autowired
	private IngredientJpaRepository ingredientJpaRepository;

	@GetMapping("/jpa/recipes/all")
	public List<Recipe> getAllRecipes() {
		return recipeJpaRepository.findAll();
	}

	@GetMapping("/jpa/users/{user_email}/recipes")
	public List<Recipe> getRecipesById(@PathVariable String user_email) {
		JwtUserDetails user = userDetailsJpaRepository.findByemail(user_email);

		return recipeJpaRepository.findByUserId(user.getId());
		// return recipeJpaRepository.findByMailOwner(mailOwner);
	}

	@PutMapping("/jpa/users/{user_email}/recipes")
	public ResponseEntity<Recipe[]> updateRecipes(@PathVariable String user_email, @RequestBody Recipe[] recipes) {
		List<Recipe> newRecipes = new ArrayList<Recipe>(Arrays.asList(recipes));
		JwtUserDetails user = userDetailsJpaRepository.findByemail(user_email);
		List<Recipe> recipeToDelete = new ArrayList<Recipe>();
		user.getRecipes().forEach(recipe -> {
			if (!newRecipes.contains(recipe)) {
				recipeToDelete.add(recipe);
			}
		});
		recipeToDelete.forEach(recipe -> {
			user.removeRecipe(recipe);
			recipe.removeAllIngredients();
			recipeJpaRepository.delete(recipe);
		});
		newRecipes.forEach(recipe -> {
			if (recipe.getUser() == null) {
				List<Ingredient> ingToAdd = new ArrayList<Ingredient>();
				recipe.getIngredients().forEach(ing -> {
						ingToAdd.add(ing);
				});
				for (Ingredient ing : ingToAdd) {
					Long id = ing.getIng_id();
					if (id == null) {
						Ingredient existIng = ingredientJpaRepository.findByNameAndAmount(ing.getName(),
								ing.getAmount());
						if (existIng != null) {
							recipe.getIngredients().remove(ing);
							Ingredient existIdIng = ingredientJpaRepository.findById(existIng.getIng_id()).get();
							recipe.addIngredient(existIdIng);
						} else {
							recipe.addIngredient(ing);
						}
					} else {
						Ingredient existIdIng = ingredientJpaRepository.findById(id).get();
						recipe.addIngredient(existIdIng);
					}	
				}
				user.addRecipe(recipe);
			}

		});
		List<Recipe> updatedRecipes = recipeJpaRepository.saveAll(newRecipes);
		// List<Recipe> updatedRecipes = new ArrayList<>();
		Recipe[] recipesArray = {};
		recipesArray = updatedRecipes.toArray(recipesArray);
		return new ResponseEntity<Recipe[]>(recipesArray, HttpStatus.OK);
	}
	/*
	 * 
	 * @PutMapping("/jpa/users/{mailOwner}/recipe") public ResponseEntity<Recipe>
	 * updateRecipe(
	 * 
	 * @PathVariable String mailOwner,@RequestBody Recipe recipe) { Long id =
	 * recipe.getId(); Recipe updatedRecipe; if (id!=-1) { Recipe recipeObj = new
	 * Recipe(id, recipe.getMailOwner(), recipe.getName(), recipe.getDescription(),
	 * recipe.getImagePath(),recipe.getIngredients()); updatedRecipe =
	 * recipeJpaRepository.save(recipeObj); } else { updatedRecipe =
	 * recipeJpaRepository.save(recipe); } //recipeJpaRepository.deleteById(id);
	 * return new ResponseEntity<Recipe>(updatedRecipe, HttpStatus.OK); }
	 */
}
