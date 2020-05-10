package com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe;


import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeJpaRepository extends JpaRepository<Recipe,Long> {
	List<Recipe> findByUserId(Long user_id);

}
