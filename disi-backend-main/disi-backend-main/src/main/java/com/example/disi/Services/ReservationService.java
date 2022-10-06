package com.example.disi.Services;

//notification
import ch.qos.logback.core.net.SyslogOutputStream;
import net.minidev.json.JSONObject;
//click pe el si add mavern dependency

import com.example.disi.DTOs.AddReservationDto;
import com.example.disi.DTOs.ReservationDto;
import com.example.disi.DTOs.TariffDto;
import com.example.disi.Entities.Court;
import com.example.disi.Entities.Person;
import com.example.disi.Entities.Reservation;
import com.example.disi.Repositories.CourtRepository;
import com.example.disi.Repositories.PersonRepository;
import com.example.disi.Repositories.ReservationRepository;

import com.example.disi.Utils.Status;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.sun.istack.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@Service
public class ReservationService {

    //modificare Notificare
    @Autowired
    SimpMessagingTemplate template;

    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy hh");

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private TariffService tariffService;

    @Autowired
    private EmailSenderService emailSenderService;

    private static final String paymentReservationSubject = "Payment Reservation";

    public List<ReservationDto> findAllReservation() {
        List<Reservation> rezervations = reservationRepository.findAll();
        List<ReservationDto> reservationDtos = new ArrayList<>();
        for (Reservation r : rezervations) {
            ReservationDto dto = ReservationDto.builder()
                    .id(r.getId())
                    .court(r.getCourt())
                    .startTime(r.getStartTime())
                    .endTime(r.getEndTime())
                    .player1(r.getPlayer1())
                    .player2(r.getPlayer2())
                    .price(r.getPrice())
                    .build();
            reservationDtos.add(dto);
        }
        return reservationDtos;
    }

    @Transactional
    public Boolean addReservation(AddReservationDto addReservationDto) {
        Person person = personRepository.getById(addReservationDto.getCreatedById());
        Court court = courtRepository.findFirstById(addReservationDto.getCourtId());
        TariffDto tariffDto = tariffService.getTariff();
        if (person == null || court == null) {
            return false;
        }


        int startHour = addReservationDto.getStartTime().getHours();
        int hours = addReservationDto.getEndTime().getHours() - addReservationDto.getStartTime().getHours();

        int price = 0;
        for (int i = 0; i < hours; i++) {
            if ((startHour >= 8) && (startHour <= 20)) {
                price = price + tariffDto.getDayTariff();
            } else {
                price = price + tariffDto.getNightTariff();
            }
            startHour++;
            if (startHour > 23) {
                startHour = 0;
            }
        }

        Reservation reservation = Reservation.builder()
                .startTime(addReservationDto.getStartTime())
                .endTime(addReservationDto.getEndTime())
                .price(price)
                .court(court)
                .status(Status.OPEN)
                .createdBy(person)
                .player1(person)
                .build();

        reservationRepository.save(reservation);

        String message = "Your reservation was generated successfully for court with id:" + addReservationDto.getCourtId() + " between dates:" +
                addReservationDto.getStartTime() + " and " + addReservationDto.getEndTime() + ".\n";
        message += ("You need to pay:" + price);
        try {
            sendReservationPaymentMail(person, person.getEmail(), price, message, addReservationDto);
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
        return true;

    }

    private void sendReservationPaymentMail(Person owner, String to, int price, String message, AddReservationDto dto) throws DocumentException, MessagingException {
        DataSource dataSource = computePdf(owner, dto, price);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(message);
        MimeBodyPart attachmentPart = new MimeBodyPart();
        attachmentPart.setDataHandler(new DataHandler(dataSource));
        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setDataHandler(new DataHandler(dataSource));
        mimeBodyPart.setFileName("Subscription Payment");
        MimeMultipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(attachmentPart);
        emailSenderService.sendMail(to, paymentReservationSubject, message, true, multipart);
    }

    private DataSource computePdf(Person owner, AddReservationDto dto, int price) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk("Hello, " + owner.getName() + "! This is your email to confirm your subscription"));
        paragraph.add(new Chunk("Your reservation was successfully generated for " +
                "court with id:" + dto.getCourtId() + " between: " +
                dto.getStartTime() + " and:" + dto.getEndTime() + ".\n"));
        paragraph.add(new Chunk("You need to pay:" + price));
        document.add(paragraph);
        document.close();
        byte[] bytes = outputStream.toByteArray();
        DataSource dataSource = new ByteArrayDataSource(bytes, "application/pdf");
        return dataSource;
    }

    @Transactional
    public String cancelSuccessfully(Long idReservation) {

        Reservation reservation = reservationRepository.findFirstById(idReservation);
        if (reservation == null) {
            return "not found";
        }
        long diffInMillis = Math.abs(new Date().getTime() - reservation.getStartTime().getTime());
        long diff = TimeUnit.HOURS.convert(diffInMillis, TimeUnit.MILLISECONDS);
        if (diff > 24) {
            reservation.setStatus(Status.CANCELED);
            return "canceled";
        }
        return "pay or find 2 players";
    }

    @Transactional
    public String payReservation(Long idReservation) {
        Reservation reservation = reservationRepository.findFirstById(idReservation);
        if (reservation == null) {
            return "not found";
        }
        reservation.setStatus(Status.PAYED);
        return "success";
    }

    @Transactional
    public String findTwoPlayers(Long idReservation) {
        Reservation reservation = reservationRepository.findFirstById(idReservation);
        if (reservation == null) {
            return "not found";
        }
        reservation.setStatus(Status.FINDING2);



        reservation.setPlayer1(null);
        reservation.setPlayer2(null);
        // Notify all users

        //modificare Notificare
        System.out.println("finding2");

        JSONObject jsonObject= new JSONObject();
        String sAux=" finding2:"+
                " , location: " + reservation.getCourt().getLocation().getDetails()+
                " , courtNumber: "+ reservation.getCourt().getNumber()+
                " , startTime:" + simpleDateFormat.format(reservation.getStartTime())+
                " , endTime:"+simpleDateFormat.format(reservation.getEndTime());
        jsonObject.put("reservation_id",sAux);
        for(Person p : personRepository.findAll()) {
            template.convertAndSend("/topic/message/"+p.getId(), jsonObject);
        }
        //pana aici

        return "success";
    }

    public Reservation findReservationById(Long id) {
        return reservationRepository.findFirstById(id);
    }

    public Boolean findOnePlayer(Long reservationId) {
        Reservation reservation = reservationRepository.findFirstById(reservationId);
        if (reservation == null) {
            return false;
        }
        reservation.setStatus(Status.FINDING1);
        reservationRepository.save(reservation);

        //modificare Notificare
        System.out.println("finding1");

        JSONObject jsonObject= new JSONObject();
        String sAux=" finding1:"+
                " , location: " + reservation.getCourt().getLocation().getDetails()+
                " , courtNumber: "+ reservation.getCourt().getNumber()+
                " , startTime:" + simpleDateFormat.format(reservation.getStartTime())+
                " , endTime:"+simpleDateFormat.format(reservation.getEndTime()) +
                " , player1: " + reservation.getCreatedBy().getName();
        jsonObject.put("reservation_id",sAux);
        for(Person p : personRepository.findAll()) {
            template.convertAndSend("/topic/message/"+p.getId(), jsonObject);
        }
        //pana aici

        return true;
    }

    public List<Reservation> getReservationsHavingFindingStatus() {
        return reservationRepository.findAll().stream().filter(e -> e.getStatus().equals(Status.FINDING1) || e.getStatus().equals(Status.FINDING2)).collect(Collectors.toList());
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getUserReservations(Long id) {
        Person person = personRepository.findById(id).get();
        if (person == null) {
            return null;
        }
        List<Reservation> createdBy = reservationRepository.findAllByCreatedBy(person);
        List<Reservation> player1 = reservationRepository.findAllByPlayer1(person);
        List<Reservation> player2 = reservationRepository.findAllByPlayer2(person);
        List<Reservation> temp1 = Stream.concat(createdBy.stream(), player1.stream()).collect(Collectors.toList());
        List<Reservation> temp2 = Stream.concat(temp1.stream(), player2.stream()).collect(Collectors.toList());
        List<Reservation> result = temp2.stream().distinct().collect(Collectors.toList());
        return result;
    }


    public List<Reservation> getReservationsFromCourt(Court court) {
        return reservationRepository.findAllByCourt(court);
    }
}
