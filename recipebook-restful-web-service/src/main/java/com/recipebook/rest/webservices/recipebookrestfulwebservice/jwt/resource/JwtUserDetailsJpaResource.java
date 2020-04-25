package com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.resource;

import java.util.Date;
import java.util.Objects;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtTokenUtil;
import com.recipebook.rest.webservices.recipebookrestfulwebservice.jwt.JwtUserDetails;

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
		Date date = jwtTokenUtil.getExpirationDateFromToken(token);
		return ResponseEntity
				.ok(new JwtTokenResponse(token, userName, email, date));

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
			//username case checked. now email
			identifier = userDetailsJpaRepository.findByemail(identifier).getUsername();
			authenticate(identifier, password);
		}
		JwtUserDetails jwtUserDetails = userDetailsJpaRepository
				.findByusername(identifier);
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
}
