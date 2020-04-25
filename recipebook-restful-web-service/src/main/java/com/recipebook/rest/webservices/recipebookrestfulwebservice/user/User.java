package com.recipebook.rest.webservices.recipebookrestfulwebservice.user;


public class User {
    private long id;
    private String username;
    private String password;
    
    
    public User() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
	public User(long id, String username, String password) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
