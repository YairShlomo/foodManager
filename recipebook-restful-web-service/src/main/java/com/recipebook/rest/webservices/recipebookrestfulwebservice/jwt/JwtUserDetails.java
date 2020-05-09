package com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Ingredient;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe.Recipe;

@Entity(name = "user")
public class JwtUserDetails implements UserDetails {

	private static final long serialVersionUID = 5155720064139820502L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String username;
	private String password;
	private String email;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "user")

	private Set<Recipe> recipes = new HashSet<Recipe>();

	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	// ,@JoinColumn(name = "quantity_id")
	@JoinTable(name = "user_ingredients", joinColumns = { @JoinColumn(name = "id") }, inverseJoinColumns = {
			@JoinColumn(name = "ing_id") })
	private Set<Ingredient> ingredients = new HashSet<Ingredient>();

	@Transient
	private Collection<? extends GrantedAuthority> authorities;

	public JwtUserDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public JwtUserDetails(String username, String password, String email, String role) {
		this.username = username;
		this.password = password;
		this.email = email;
		List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
		authorities.add(new SimpleGrantedAuthority(role));
		this.authorities = authorities;
	}

	@JsonIgnore
	public Long getId() {
		return id;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public String getEmail() {
		return email;
	}

	public Set<Ingredient> getIngredients() {
		return ingredients;
	}
	/*
	 * public void setIngredients(Set<Ingredient> ingredients) { this.ingredients =
	 * ingredients; }
	 */

	public void addIngredient(Ingredient ingredient) {
		// prevent endless loop
		if (ingredient.getUsers().contains(this)) {
			ingredients.add(ingredient);
			return;
		}
		this.ingredients.remove(ingredient);
		ingredient.addUser(this);
	}

	public void removeIngredient(Ingredient ingredient) {
		ingredients.remove(ingredient);
	}

	public Set<Recipe> getRecipes() {
		return recipes;
	}

	/*
	 * public void setRecipes(List<Recipe> newRecipes) {
	 * System.out.println("set recipes in user"); for(Recipe oldRecipe:
	 * this.recipes) { if (!newRecipes.contains(oldRecipe)) {
	 * this.recipes.remove(oldRecipe); oldRecipe.setUser(null); } } for(Recipe
	 * recipe: newRecipes) { if (!this.recipes.contains(recipe)) {
	 * this.recipes.add(recipe); recipe.setUser(this); }
	 * 
	 * } //this.recipes = recipes; }
	 */
	public void addRecipe(Recipe recipe) {
		if (recipes.contains(recipe)) {
			return;
		}
		recipes.add(recipe);
		recipe.setUser(this);
	}

	public void removeRecipe(Recipe recipe) {
		recipes.remove(recipe);
		// ArrayList<Ingredient> emptyIngs=new ArrayList<Ingredient>();
		// recipe.removeAllIngredients();
		recipe.setUser(null);

	}

}
