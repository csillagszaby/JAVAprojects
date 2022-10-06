package com.example.disi.Controllers;

import com.example.disi.DTOs.*;
import com.example.disi.DTOs.Person.FindPlayerDto;
import com.example.disi.Entities.Person;
import com.example.disi.SecurityConfig.JwtTokenUtil;
import com.example.disi.Services.EmailSenderService;
import com.example.disi.Services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(exposedHeaders = "authorization")
@RequestMapping(value = "/person")
@RequiredArgsConstructor
public class PersonController {

    private final EmailSenderService emailSenderService;
    private final PersonService personService;
    private final JwtTokenUtil tokenUtil;


    @PostMapping(value = "/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto dto) {

        return new ResponseEntity<>(personService.resetPassword(dto), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity all() {
        return ResponseEntity.status(HttpStatus.OK).body(personService.getAll());
    }

    @PostMapping(value = "/login")
    public ResponseEntity<PersonDto> login(@RequestBody AuthenticationRequest request) {

        PersonDto person = personService.logIn(request);
        if (person != null) {

            String token = tokenUtil.generateToken(person);
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, ("Bearer " + token)).body(person);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        Boolean result = personService.register(registerDto);
        if (result) {
            return new ResponseEntity<>("User created", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("This email is already in use!", HttpStatus.OK);
        }
    }

    @PostMapping(value = "/generateCode")
    public ResponseEntity<String> generateCode(@RequestBody GenerateCodeDto dto) {
        return new ResponseEntity<>(personService.generateCode(dto), HttpStatus.OK);
    }

    @PostMapping(value = "/enrollMe")
    public ResponseEntity<String> enrollPlayer(@RequestBody FindPlayerDto dto){
        return new ResponseEntity<>(personService.enrollPlayer(dto),HttpStatus.OK);
    }
}
