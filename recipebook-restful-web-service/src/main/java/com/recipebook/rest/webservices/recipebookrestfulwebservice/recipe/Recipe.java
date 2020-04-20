package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
@Entity
public class Recipe {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
    private String name;
    private String description;
    private String imagePath;
    private Ingredient[] ingredients;
    
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
	public Ingredient[] getIngredients() {
		return ingredients;
	}
	public void setIngredients(Ingredient[] ingredients) {
		this.ingredients = ingredients;
	}
	
}
