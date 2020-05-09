package com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.Ingredient;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.ingredient.IngredientJpaRepository;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtTokenUtil;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.recipe.Recipe;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class JwtUserDetailsJpaResource implements UserDetailsService {

	@Value("${jwt.http.request.header}")
	private String tokenHeader;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	// private UserDetailsService jwtInMemoryUserDetailsService;
	private UserDetailsJpaRepository userDetailsJpaRepository;

	@Autowired
	private IngredientJpaRepository ingredientJpaRepository;

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping("${jwt.signup.uri}")
	public ResponseEntity<?> signUp(@RequestBody JwtTokenRequest authenticationRequest) throws AuthenticationException {
		String userName = authenticationRequest.getUsername();
		String password = authenticationRequest.getPassword();
		String email = authenticationRequest.getEmail();
		if (isUserExist(userName, email)) {
			throw new AuthenticationException("USER_EXISTS", null);
		}
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedString = encoder.encode(password);
		JwtUserDetails jwtUserDetails = new JwtUserDetails(userName, encodedString, email, "ROLE_USER_2");
		userDetailsJpaRepository.save(jwtUserDetails);
		final String token = jwtTokenUtil.generateToken(jwtUserDetails);
		System.out.println(token);
		Date date = jwtTokenUtil.getExpirationDateFromToken(token);
		return ResponseEntity.ok(new JwtTokenResponse(token, userName, email, date));

	}

	private boolean isUserExist(String userName, String email) {
		JwtUserDetails userExistsByName = userDetailsJpaRepository.findByusername(userName);
		JwtUserDetails userExistsByEmail = userDetailsJpaRepository.findByemail(email);
		if ((userExistsByName != null) || (userExistsByEmail != null)) {
			return true;
		}
		return false;
	}

	@PostMapping("${jwt.signin.uri}")
	public ResponseEntity<?> signIn(@RequestBody JwtTokenRequest authenticationRequest) throws AuthenticationException {
		String identifier = authenticationRequest.getUsername();
		String password = authenticationRequest.getPassword();
		try {
			authenticate(identifier, password);
		} catch (AuthenticationException e) {
			// username case checked. now email
			identifier = userDetailsJpaRepository.findByemail(identifier).getUsername();
			authenticate(identifier, password);
		}
		JwtUserDetails jwtUserDetails = userDetailsJpaRepository.findByusername(identifier);
		final String token = jwtTokenUtil.generateToken(jwtUserDetails);
		System.out.println(token);
		Date date = jwtTokenUtil.getExpirationDateFromToken(token);
		return ResponseEntity
				.ok(new JwtTokenResponse(token, jwtUserDetails.getUsername(), jwtUserDetails.getEmail(), date));
	}

	// refresh
	@GetMapping("${jwt.refresh.token.uri}")
	public ResponseEntity<?> refreshAndGetAuthenticationToken(HttpServletRequest request) {
		String authToken = request.getHeader(tokenHeader);
		final String token = authToken.substring(7);
		String username = jwtTokenUtil.getUsernameFromToken(token);
		JwtUserDetails jwtUserDetails = (JwtUserDetails) userDetailsJpaRepository.findByusername(username);
		if (jwtTokenUtil.canTokenBeRefreshed(token)) {
			String refreshedToken = jwtTokenUtil.refreshToken(token);
			Date date = jwtTokenUtil.getExpirationDateFromToken(token);

			return ResponseEntity.ok(new JwtTokenResponse(refreshedToken, jwtUserDetails.getUsername(),
					jwtUserDetails.getEmail(), date));
		} else {
			return ResponseEntity.badRequest().body(null);
		}
	}

	@ExceptionHandler({ AuthenticationException.class })
	public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	}

	private void authenticate(String username, String password) {
		Objects.requireNonNull(username);
		Objects.requireNonNull(password);

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new AuthenticationException("USER_DISABLED", e);
		} catch (BadCredentialsException e) {
			throw new AuthenticationException("INVALID_CREDENTIALS", e);
		}
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		JwtUserDetails user = userDetailsJpaRepository.findByusername(username);
		if (user == null) {
			throw new UsernameNotFoundException(String.format("USER_NOT_FOUND '%s'.", username));
		}
		return user;
	}

	@PutMapping("/jpa/users/{user_id}/ingredients")
	public ResponseEntity<Ingredient[]> updateIngredients(@PathVariable Long user_id,
			@RequestBody Ingredient[] ingredients) {
		Optional<JwtUserDetails> optUser = userDetailsJpaRepository.findById(user_id);
		JwtUserDetails user = optUser.get();
		List<Ingredient> newIngs = new ArrayList<Ingredient>(Arrays.asList(ingredients));
		List<Ingredient> ingToDelete = new ArrayList<Ingredient>();
		user.getIngredients().forEach(ing -> {
			if (!newIngs.contains(ing)) {
				ingToDelete.add(ing);
			}
		});
		ingToDelete.forEach(ing -> {
			ing.deleteUser(user);
			user.removeIngredient(ing);
		});

		newIngs.forEach(ing -> {
			Long id = ing.getIng_id();
			if (id == null) {
				Ingredient existIng = ingredientJpaRepository.findByNameAndAmount(ing.getName(), ing.getAmount());
				if (existIng != null) {
					user.addIngredient(existIng);
				} else {
					user.addIngredient(ing);
				}
			} else {
				Ingredient existIdIng = ingredientJpaRepository.findById(id).get();
				user.addIngredient(existIdIng);
			}

		});

		JwtUserDetails updatedUser = userDetailsJpaRepository.save(user);
		// JwtUserDetails updatedUser = new JwtUserDetails();
		Ingredient[] ingredientArray = {};
		ingredientArray = updatedUser.getIngredients().toArray(ingredientArray);
		return new ResponseEntity<Ingredient[]>(ingredientArray, HttpStatus.OK);
	}

	@GetMapping("/jpa/users/{user_id}/ingredients")
	public Set<Ingredient> getIngredientsById(@PathVariable Long id) {
		return userDetailsJpaRepository.findById(id).get().getIngredients();
	}

}
