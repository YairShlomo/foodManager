package com.recipebook.rest.webservices.recipebookrestfulwebservice;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class BycryptEncoderTest {
	
	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		for(int i=1; i<=10; i++) {
			String encodedString = encoder.encode("password@test");
			System.out.println(encodedString);
		}
	}

}
