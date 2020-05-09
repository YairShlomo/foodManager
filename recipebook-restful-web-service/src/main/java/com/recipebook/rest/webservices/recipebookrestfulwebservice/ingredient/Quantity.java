package com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class Quantity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long quantity_id;
	private Long amount;
	
	public Quantity() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Quantity(Long quantity_id, Long amount) {
		super();
		this.quantity_id = quantity_id;
		this.amount = amount;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}
	
	
	
}
