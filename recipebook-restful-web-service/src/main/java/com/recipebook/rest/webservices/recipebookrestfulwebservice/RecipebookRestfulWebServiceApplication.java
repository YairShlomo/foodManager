package com.recipebook.rest.webservices.recipebookrestfulwebservice;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Ingredient;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.IngredientJpaRepository;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource.UserDetailsJpaRepository;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe.Recipe;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe.RecipeJpaRepository;

@SpringBootApplication
public class RecipebookRestfulWebServiceApplication implements CommandLineRunner{
	@Autowired
	private RecipeJpaRepository recipeJpaRepository;
	@Autowired
	private IngredientJpaRepository ingredientJpaRepository;
	@Autowired
	private UserDetailsJpaRepository userDetailsJpaRepository;
	public static void main(String[] args) {
		SpringApplication.run(RecipebookRestfulWebServiceApplication.class, args);
	}
	
	 @Override
	    public void run(String... args) throws Exception {
		
	        // Cleanup the tables
		 recipeJpaRepository.deleteAllInBatch();
		 ingredientJpaRepository.deleteAllInBatch();
		 /*
		 Ingredient ing1 = new Ingredient(-1L,"ing1",1l,null,null);
	     List<Ingredient> ingredientList = new ArrayList<Ingredient>();
	     ingredientList.add(ing1);
			JwtUserDetails user1 = userDetailsJpaRepository.findById(1L).get();
			JwtUserDetails user2 = userDetailsJpaRepository.findById(2L).get();

	     Recipe recipe1 = new Recipe(null,null,"recipe1","good recipe","https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/07/epic-summer-salad.jpg?itok=RbLJZDhs"
	        		,ingredientList);
		List<Recipe> newRecipes1 = new ArrayList<Recipe>();
		List<Recipe> newRecipes2 = new ArrayList<Recipe>();

	     Recipe recipe2 = new Recipe(null,null,"recipe2","good recipe","https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/07/epic-summer-salad.jpg?itok=RbLJZDhs"
	        		,ingredientList);
	     newRecipes1.add(recipe1);
	     newRecipes2.add(recipe2);
			newRecipes1.forEach(recipe -> {
				//Recipe newRecipe = recipe;
				System.out.println("ing size:"+recipe.getIngredients().size());
				System.out.println(recipe.getRecipeId());
				if(recipe.getUser()==null) {
					user1.addRecipe(recipe);
					System.out.println("ing added");

					//recipe.setUser(user);
				}

			});
			newRecipes2.forEach(recipe -> {
				//Recipe newRecipe = recipe;
				System.out.println("ing size:"+recipe.getIngredients().size());
				System.out.println(recipe.getRecipeId());
				if(recipe.getUser()==null) {
					user2.addRecipe(recipe);
					System.out.println("ing added");

					//recipe.setUser(user);
				}

			});

	    List<Recipe> updatedRecipes1 = recipeJpaRepository.saveAll(newRecipes1);

	     //List<Recipe> updatedRecipes2 = recipeJpaRepository.saveAll(newRecipes2);
	//	 userDetailsJpaRepository.deleteAllInBatch();

	      
	         */
	 }
}
