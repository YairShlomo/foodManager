package com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource;

import org.springframework.stereotype.Repository;

import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserDetailsJpaRepository extends JpaRepository<JwtUserDetails,Long> {
	JwtUserDetails findByusername(String username);
	JwtUserDetails findByemail(String email);
}
