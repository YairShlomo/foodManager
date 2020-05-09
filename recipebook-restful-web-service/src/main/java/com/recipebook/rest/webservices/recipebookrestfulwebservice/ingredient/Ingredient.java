package com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import org.hibernate.annotations.NaturalId;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe.Recipe;

@Entity
public class Ingredient {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long ing_id;
	// @NaturalId
	private String name;
	// @NaturalId
	private Long amount;
	@ManyToMany(mappedBy = "ingredients", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JsonIgnore
	private Set<Recipe> recipes = new HashSet<Recipe>();;
	@ManyToMany(mappedBy = "ingredients")
	@JsonIgnore
	private Set<JwtUserDetails> users = new HashSet<JwtUserDetails>();

	public Ingredient() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Ingredient(Long ing_id, String name, Long amount, Set<Recipe> recipes, Set<JwtUserDetails> users) {
		super();
		this.ing_id = ing_id;
		this.name = name;
		this.amount = amount;
		this.recipes = recipes;
		this.users = users;
	}

	public Long getIng_id() {
		return ing_id;
	}

	public void setIng_id(Long ing_id) {
		this.ing_id = ing_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Recipe> getRecipes() {
		return recipes;
	}

	public void addRecipe(Recipe recipe) {
		System.out.println("add recipe");
		// prevent endless loop
		if (recipes.contains(recipe)) {
			return;
		}
		recipes.add(recipe);
		recipe.addIngredient(this);

	}

	public void deleteRecipe(Recipe recipe) {
		this.recipes.remove(recipe);
	}

	/*
	 * public void setRecipes(Set<Recipe> newRecipes) {
	 * System.out.println("set setRecipes in Ingredients"); this.recipes =
	 * newRecipes; }
	 */

	public void addUser(JwtUserDetails user) {
		// prevent endless loop
		if (users.contains(user)) {
			return;
		}
		users.add(user);
		user.addIngredient(this);

	}

	public void deleteUser(JwtUserDetails user) {
		this.users.remove(user);
	}

	public Set<JwtUserDetails> getUsers() {
		return users;
	}
	/*
	 * public void setUsers(Set<JwtUserDetails> users) { //for (JwtUserDetails user:
	 * users) { this.users = users;
	 * 
	 * }
	 */

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		//result = prime * result + ((amount == null) ? 0 : amount.hashCode());
		result = prime * result + ((ing_id == null) ? 0 : ing_id.hashCode());
		//result = prime * result + ((name == null) ? 0 : name.hashCode());
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
		Ingredient other = (Ingredient) obj;
		if (ing_id == null) {
			if (other.ing_id != null)
				return false;
		} else if (!ing_id.equals(other.ing_id))
			return false;
		/*
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
			return false;

		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
			*/
		return true;
	}
	
	
/*
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Ingredient other = (Ingredient) obj;
		if (ing_id == null) {
			if (other.ing_id != null)
				return false;
		} else if (!ing_id.equals(other.ing_id))
			return false;
		return true;
	}
*/

	
}
