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

	@GetMapping("/jpa/users/{user_id}/recipes")
	public List<Recipe> getRecipesById(@PathVariable Long user_id) {
		return recipeJpaRepository.findByUserId(user_id);
		// return recipeJpaRepository.findByMailOwner(mailOwner);
	}

	@PutMapping("/jpa/users/{user_id}/recipes")
	public ResponseEntity<Recipe[]> updateRecipes(@PathVariable Long user_id, @RequestBody Recipe[] recipes) {
		List<Recipe> newRecipes = new ArrayList<Recipe>(Arrays.asList(recipes));
		Optional<JwtUserDetails> optUser = userDetailsJpaRepository.findById(user_id);
		JwtUserDetails user = optUser.get();
		List<Recipe> recipeToDelete = new ArrayList<Recipe>();
		user.getRecipes().forEach(recipe -> {
			if (!newRecipes.contains(recipe)) {
				System.out.println("add recipe to delete");
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
				// Set<Ingredient> existSet = new HashSet<Ingredient>();

				for (Ingredient ing : recipe.getIngredients()) {
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

				/*
				 * Set<Ingredient> existSet = recipe.addIngredients(); for(Ingredient ing:
				 * existSet) { Long id = ing.getIng_id(); Ingredient existIng =
				 * ingredientJpaRepository.findById(id).get(); recipe.addIngredient(existIng); }
				 */
				user.addRecipe(recipe);
				System.out.println("ing added");
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
