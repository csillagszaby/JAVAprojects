package com.example.disi.Services;

import com.example.disi.DTOs.*;
import com.example.disi.DTOs.Person.FindPlayerDto;
import com.example.disi.Entities.Code;
import com.example.disi.Entities.Person;
import com.example.disi.Entities.Reservation;
import com.example.disi.Repositories.CodeRepository;
import com.example.disi.Repositories.PersonRepository;
import com.example.disi.Utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PersonService {


    private final PersonRepository personRepository;
    private final ReservationService reservationService;
    private final EmailSenderService emailSenderService;
    private final CodeRepository codeRepository;

    @Bean   //to move to app security
    public BCryptPasswordEncoder bcryptPasswordEncoder(){return new BCryptPasswordEncoder();}

    @Autowired
    PasswordEncoder passwordEncoder;

    public PersonDto logIn(AuthenticationRequest request) {

        Optional<Person> personOp = personRepository.findByEmail(request.getEmail());

        if(personOp.isPresent()) {
            Person person = personOp.get();
            if (passwordEncoder.matches(request.getPassword(),person.getPassword())) {
                PersonDto dto = PersonDto.builder().build();
                dto.setId(person.getId());
                dto.setEmail(person.getEmail());
                dto.setIsAdmin(person.getIsAdmin());
                dto.setUsername(person.getUsername());
                dto.setName(person.getName());
                dto.setPhone(person.getPhone());
//                dto.setRezervations(person.getReservations());
//                dto.setSubscriptions(person.getSubscriptions());

                return dto;
            }
        }
        return null;
    }

    public List<Person> getAll() {
        return personRepository.findAll();
    }

    public Boolean register(RegisterDto registerDto){
        Person p = new Person();
        if(personRepository.findByEmail(registerDto.getEmail()).isPresent()){
            return false;
        }else{
            p.setPhone(registerDto.getPhone());
            p.setName(registerDto.getName());
            p.setEmail(registerDto.getEmail());
            p.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            p.setIsAdmin(false);
            personRepository.save(p);
            return true;
        }
    }

    public String generateCode(GenerateCodeDto dto){
        String generatedCode=emailSenderService.codeGeneration();
        Calendar now=Calendar.getInstance();
        now.add(Calendar.MINUTE,1);
        Date expirationDate=now.getTime();
        System.out.println(expirationDate);
        Code code=null;
        code=codeRepository.findFirstByEmail(dto.getEmail());
        if(code==null){
            code=Code.builder().code(generatedCode).email(dto.getEmail()).dateExpiration(expirationDate).build();

        }
        else{
            code.setCode(generatedCode);
            code.setDateExpiration(expirationDate);

        }
        codeRepository.save(code);
        String subject="Reset Password Code";
        String message="Your code to reset the password is: "+generatedCode;
        emailSenderService.sendMail(dto.getEmail(),subject,message,false,null);
        return "Succes";


    }

    @Transactional
    public String resetPassword(ResetPasswordDto dto){

        Person person=personRepository.findByEmail(dto.getEmail()).get();
        if(person==null){
            return "Person with email "+dto.getEmail()+" does not exist";
        }
        Code code=codeRepository.findFirstByEmail(dto.getEmail());
        if(code==null){
            return "Does not exist a code for the email:"+dto.getEmail();
        }
        Date now=Calendar.getInstance().getTime();
        long diff=now.getTime()-code.getDateExpiration().getTime();
        diff= TimeUnit.MILLISECONDS.toMinutes(diff);
        if(diff>1){
            return "Time to reset your password is expired";
        }
        if(!code.getCode().equals(dto.getCode())){
            return "You introduced a wrong code";
        }
        person.setPassword(passwordEncoder.encode(dto.getPassword()));
        return "Succes";
    }

    @Transactional
    public String enrollPlayer(FindPlayerDto dto){
        Optional<Person> person=personRepository.findById(dto.getUserId());
        if(!person.isPresent()){
            return "Person not found";
        }
        Reservation reservation=reservationService.findReservationById(dto.getReservationId());
        if(reservation==null){
            return "Reservation not found";
        }
        if(reservation.getStatus().equals(Status.FINDING2)){
            if(reservation.getPlayer1()==null){
                reservation.setPlayer1(person.get());
                return "Player 1 set";
            }
            if(reservation.getPlayer2()==null){
                if(reservation.getPlayer1().equals(person.get())){
                    return "This person is already enrolled at this reservation";
                }
                reservation.setPlayer2(person.get());
                reservation.setStatus(Status.READY);
                return "Player 2 set";
            }
            if(reservation.getPlayer1()!=null && reservation.getPlayer2()!=null){
                reservation.setStatus(Status.READY);
            }

        }

        // Enroll PLAYER 1 PART
        if(reservation.getStatus().equals(Status.FINDING1)){
            if(reservation.getPlayer1()==null){
                reservation.setPlayer1(person.get());
                return "Player 1 set";
            }
            if(reservation.getPlayer2()==null){
                if(reservation.getPlayer1().equals(person.get())){
                    return "This person is already enrolled at this reservation";
                }
                reservation.setPlayer2(person.get());
                reservation.setStatus(Status.READY);
                return "Player 2 set";
            }
            if(reservation.getPlayer1()!=null && reservation.getPlayer2()!=null){
                reservation.setStatus(Status.READY);
            }

        }

        //If there is an error
        return "err";
    }
}
