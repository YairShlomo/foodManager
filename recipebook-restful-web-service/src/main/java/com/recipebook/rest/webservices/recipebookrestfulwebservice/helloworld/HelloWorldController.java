package com.recipebook.rest.webservices.recipebookrestfulwebservice.helloworld;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

//Controller
@CrossOrigin(origins="http://localhost:4200")
@RestController
public class HelloWorldController {
	//URI - /hello-world
	@GetMapping(path="/hello-world")
	public String helloWorld() {
		return "Hello World";
	}
	
	//hello-world-bean
	@GetMapping(path="/hello-world-bean")
	public HelloWorldBean helloWorldBean() {
		return new HelloWorldBean("Hello World");
	}
	
	///hello-world/path-variable/?
	@GetMapping(path="/hello-world/path-variable/{name}")
	public HelloWorldBean helloWorldPathVar(@PathVariable String name) {
		return new HelloWorldBean(String.format("Hello World, %s",name));
	}
}
