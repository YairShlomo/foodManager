package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;


import org.hibernate.annotations.Type;

@Entity
public class Recipe {
	@Id
	@GeneratedValue
	private Long id;
	private String mailOwner;
	private String name;
	private String description;
	private String imagePath;
	//@Convert(converter = JpaConverterJson.class)
    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    //@Column(name = "phone_number")
	private List<Ingredient> ingredients;

	public Recipe(Long id, String mailOwner, String name, String description, String imagePath,
			List<Ingredient> ingredients) {
		super();
		this.id = id;
		this.mailOwner = mailOwner;
		this.name = name;
		this.description = description;
		this.imagePath = imagePath;
		this.ingredients = ingredients;
	}

	public Recipe() {
		super();
		// TODO Auto-generated constructor stub
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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Ingredient> getIngredients() {
		return ingredients;
	}

	public void setIngredients(List<Ingredient> ingredients) {
		this.ingredients = ingredients;
	}

	public String getMailOwner() {
		return mailOwner;
	}

	public void setMailOwner(String mailOwner) {
		this.mailOwner = mailOwner;
	}

}
