package com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource;

import java.io.Serializable;
import java.util.Date;

public class JwtTokenResponse implements Serializable {

  private static final long serialVersionUID = 8317676219297719109L;

  private final String token;
    
  private final String username;

  private final String email;

  private final Date expirationDate;

  public JwtTokenResponse(String token, String username, String email, Date expirationDate) {
	  super();
	  this.token = token;
	  this.username = username;
	  this.expirationDate = expirationDate;
	  this.email = email;

  }

  public static long getSerialversionuid() {
	  return serialVersionUID;
  }
	
  public String getToken() {
	  return token;
  }
	
  public String getUsername() {
	  return username;
  }
	
  public Date getExpirationDate() {
	  return expirationDate;
  }

  public String getEmail() {
	return email;
  }
  
  
	
}