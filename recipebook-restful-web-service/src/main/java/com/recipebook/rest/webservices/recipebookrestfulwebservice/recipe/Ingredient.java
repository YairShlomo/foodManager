package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;

import java.io.Serializable;

import javax.persistence.Embeddable;
public class Ingredient implements Serializable{
	private String name;
	private Long amount;
	
	public Ingredient() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Ingredient(String name, Long amount) {
		super();
		this.name = name;
		this.amount = amount;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getAmount() {
		return amount;
	}
	public void setAmount(Long amount) {
		this.amount = amount;
	}
}
