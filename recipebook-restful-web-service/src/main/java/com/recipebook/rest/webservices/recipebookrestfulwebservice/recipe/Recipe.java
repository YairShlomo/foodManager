package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Ingredient;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Quantity;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;

@Entity
public class Recipe {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long recipeId;
	@JsonIgnore
	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinColumn(name = "user_id")
	private JwtUserDetails user;
	private String name;
	private String description;
	private String imagePath;
	// @ElementCollection
	// @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name
	// = "recipe_id"))
	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "recipe_ingredients", joinColumns = { @JoinColumn(name = "recipe_id") }, inverseJoinColumns = {
			@JoinColumn(name = "ing_id") })
	private Set<Ingredient> ingredients = new HashSet<Ingredient>();

	/*
	 * @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.ALL })
	 * 
	 * @JoinTable(name = "recipe_ingredients", joinColumns = { @JoinColumn(name =
	 * "recipe_id") }, inverseJoinColumns = { @JoinColumn(name = "quantity_id") })
	 * private List<Quantity> quantities;
	 */

	public Recipe() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Recipe(Long recipeId, JwtUserDetails user, String name, String description, String imagePath,
			Set<Ingredient> ingredients) {
		super();
		this.recipeId = recipeId;
		this.user = user;
		this.name = name;
		this.description = description;
		this.imagePath = imagePath;
		this.ingredients = ingredients;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public void setUser(JwtUserDetails user) {
		this.user = user;
		if (user == null) {
			return;
		}
		user.addRecipe(this);
	}

	public JwtUserDetails getUser() {
		return user;
	}

	public Set<Ingredient> getIngredients() {
		return ingredients;
	}

	public void addIngredient(Ingredient ingredient) {
		// prevent endless loop
		if (ingredient.getRecipes().contains(this)) {
			ingredients.add(ingredient);
			return;
		}
		this.ingredients.remove(ingredient);
		ingredient.addRecipe(this);
	}

	public void removeAllIngredients() {
		List<Ingredient> ingsToDelete = new ArrayList<Ingredient>();
		this.ingredients.forEach(ing -> {
			ingsToDelete.add(ing);
		});
		ingsToDelete.forEach(ing -> {
			ing.deleteRecipe(this);
			this.ingredients.remove(ing);
		});
	}

	public Long getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(Long recipeId) {
		this.recipeId = recipeId;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((recipeId == null) ? 0 : recipeId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Recipe other = (Recipe) obj;
		if (recipeId == null) {
			return false;
		} else if (!recipeId.equals(other.recipeId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Recipe [recipeId=" + recipeId + ", user=" + user + ", name=" + name + ", description=" + description
				+ ", imagePath=" + imagePath + ", ingredients=" + ingredients + "]";
	}

	/*
	 * public List<Quantity> getQuantities() { return quantities; }
	 * 
	 * public void setQuantities(List<Quantity> quantities) { this.quantities =
	 * quantities; }
	 */

}
