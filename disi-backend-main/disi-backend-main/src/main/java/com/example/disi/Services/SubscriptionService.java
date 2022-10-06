package com.example.disi.Services;

import com.example.disi.DTOs.Subscription.AddSubscriptionDto;
import com.example.disi.Entities.*;
import com.example.disi.Repositories.*;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.sun.istack.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private static final int dayStart = 8;
    private static final int dayEnd = 20;
    private static final String paymentSubscriptionSubject = "Payment Subscription";
    private final ReservationRepository reservationRepository;
    private final CourtRepository courtRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PersonRepository personRepository;
    private final SubscriptionCalendarRepository subscriptionCalendarRepository;
    private final TariffRepository tariffRepository;
    private final EmailSenderService emailSenderService;

    public List<Subscription> getAllSubscriptions(){
        return subscriptionRepository.findAll();
    }

    public List<Subscription> getUserSubscription(Long id){
        Person person=personRepository.findById(id).get();
        if(person==null){
            return null;
        }
        return subscriptionRepository.findAllByCreatedBy(person);
    }

    public List<Subscription> getSubscriptionsForCourt(Court court){
        return subscriptionRepository.findAllByCourt(court);
    }

    @Transactional
    public String addSubscription(AddSubscriptionDto dto) throws ParseException {

        if(courtRepository.findFirstById(dto.getCourtId())==null){
            return "Court Not Found";
        }

        // Check if there is no subscription made when the user wants to make a new subscription
        Subscription subscription = subscriptionRepository.findFirstByCourt_IdAndMonthAndStartHourAndEndHour(dto.getCourtId(), dto.getMonth(), dto.getStartHour(), dto.getEndHour());
        if (subscription != null) {
            return "There is a subscription for court " + dto.getCourtId() + " for dates " + dto.getStartHour() + " " + dto.getEndHour();
        }
        // Check if there is no reservation made when the user wants to make a new subscription
        String temp = checkReservation(dto);
        if (!(temp.equals("ok"))) {
            return temp;
        }
        // Check if there is no subscription made when the user wants to make a new subscription
        temp = checkSubscription(dto);
        if (!(temp.equals("ok"))) {
            return temp;
        }
        // Create the new subscription
        Court court = courtRepository.findFirstById(dto.getCourtId());
        Person createdBy = personRepository.findById(dto.getCreatedById()).get();
        Tariff tariff = tariffRepository.findAll().get(0);
        int startHour = Integer.parseInt(dto.getStartHour());
        int price = computePrice(tariff, startHour, dto.getStartHour(), dto.getEndHour());
        price *= getDaysOfMonth(dto.getMonth());
        Subscription sub = Subscription.builder().startHour(dto.getStartHour())
                .endHour(dto.getEndHour()).month(dto.getMonth())
                .court(court).createdBy(createdBy).price(price).build();
        subscriptionRepository.save(sub);
//        createdBy.getSubscriptions().add(sub);
        // Save record for SubscriptionCalendar Table
        saveSubscriptionCalendar(sub, dto.getStartHour(), dto.getEndHour(), dto.getMonth());
        String message = "Your subscription was successfully generated for " +
                "court with id:" + dto.getCourtId() + " for month: " +
                dto.getMonth() + " and between hours:" + dto.getStartHour() + " and " + dto.getEndHour() + "\n";
        message += ("You need to pay:" + price);
        try {

            sendSubscriptionPaymentMail(createdBy, dto, createdBy.getEmail(), price, message);
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return "ok";
    }

    private int computePrice(Tariff tariff, int startHour, String startTime, String endTime) {
        int price = 0;
        int duration = Integer.parseInt(endTime) - Integer.parseInt(startTime);
        if (startHour >= dayStart && startHour <= dayEnd) {
            price = tariff.getDayTariff();
        } else {
            price = tariff.getNightTariff();
        }
        return price * duration;
    }

    private int getDaysOfMonth(String month) throws ParseException {
        int currentYear = new Date().getYear() + 1900;
        String month1 = (month) + " " + (currentYear);
        int monthNumber = (new SimpleDateFormat("MMMM yyyy", Locale.ENGLISH).parse(month1).getMonth());
        int daysOfMonth = (YearMonth.of(currentYear, monthNumber + 1).lengthOfMonth());
        return daysOfMonth;
    }

    private void saveSubscriptionCalendar(Subscription subscription, String startHour, String endHour, String month) throws ParseException {
        Date startDate;
        Date endDate;
        int daysOfMonth = getDaysOfMonth(subscription.getMonth());
        for (int i = 1; i <= daysOfMonth; i++) {
            String startStringDate = (month + " " + i + " " + startHour) + " " + (new Date().getYear() + 1900);
            String endStringDate = (month + " " + i + " " + endHour) + " " + (new Date().getYear() + 1900);

            startDate = new SimpleDateFormat("MMMM d H yyyy", Locale.ENGLISH).parse(startStringDate);
            endDate = new SimpleDateFormat("MMMM d H yyyy", Locale.ENGLISH).parse(endStringDate);

            SubscriptionCalendar subscriptionCalendar = SubscriptionCalendar.builder().subscription(subscription)
                    .startDate(startDate).endDate(endDate).build();
            subscriptionCalendarRepository.save(subscriptionCalendar);


        }
    }

    private String checkSubscription(AddSubscriptionDto dto) throws ParseException {

        List<Subscription> subscriptionList = subscriptionRepository.findAllByCourt_IdAndMonth(dto.getCourtId(), dto.getMonth());
        Date startDate;
        Date endDate;
        // Start and end hour for the new subscription
        int startHour = Integer.parseInt(dto.getStartHour());
        int endHour = Integer.parseInt(dto.getEndHour());
        for (Subscription subscription : subscriptionList) {
            // Start and end hour for current subscription
            int startHourSubscription = Integer.parseInt(subscription.getStartHour());
            int endHourSubscription = Integer.parseInt(subscription.getEndHour());


            if (startHourSubscription <= startHour && endHourSubscription > startHour) {
                return "There is already a subscription on court " + dto.getCourtId() +
                        " for dates " + dto.getStartHour() + " and " + dto.getEndHour();
            }

            if (startHourSubscription <= endHour && endHour <= endHourSubscription) {
                return "There is already a subscription on court " + dto.getCourtId() +
                        " for dates " + dto.getStartHour() + " and " + dto.getEndHour();

            }

            if (startHour < startHourSubscription && endHour > endHourSubscription) {
                return "There is already a subscription on court " + dto.getCourtId()
                        + " for dates " + dto.getStartHour() + " and " + dto.getEndHour();

            }
        }
        return "ok";
    }

    // Check if there is no reservation made when the user wants to make a new subscription
    private String checkReservation(AddSubscriptionDto dto) throws ParseException {
        // Get all reservations for a specific court and a specific month
        List<Reservation> reservationList = reservationRepository.findAll().stream().filter(e -> (e.getCourt().getId().equals(dto.getCourtId()))
                && new SimpleDateFormat("MMMM", Locale.ENGLISH).format(e.getStartTime()).equals(dto.getMonth())
                && new SimpleDateFormat("MMMM", Locale.ENGLISH).format(e.getEndTime()).equals(dto.getMonth())
        ).collect(Collectors.toList());
        Date startDate;
        Date endDate;

        int daysOfMonth = getDaysOfMonth(dto.getMonth());
        int currentYear = new Date().getYear() + 1900;
        for (Reservation reservation : reservationList) {
            for (int i = 1; i <= daysOfMonth; i++) {
                String startStringDate = (dto.getMonth() + " " + i + " " + dto.getStartHour()) + " " + (currentYear);
                String endStringDate = (dto.getMonth() + " " + i + " " + dto.getEndHour()) + " " + (currentYear);

                startDate = new SimpleDateFormat("MMMM d H yyyy", Locale.ENGLISH).parse(startStringDate);
                endDate = new SimpleDateFormat("MMMM d H yyyy", Locale.ENGLISH).parse(endStringDate);

                // reservation.start<=dto.getStartDate<=reservation.end, start [res.start,res.end)
                if (reservation.getStartTime().compareTo(startDate) <= 0 && (reservation.getEndTime().compareTo(startDate) > 0)) {
                    return "There are already exists a reservation on court " + dto.getCourtId() + " for " + startDate + " and " + endDate;
                }
                // reservation.start<=dto.getEndDate<=reservation.end, end [res.start,res.end]
                if (reservation.getStartTime().compareTo(endDate) <= 0 && (reservation.getEndTime().compareTo(endDate) >= 0)) {
                    return "There are already exists a reservation on court " + dto.getCourtId() + " for " + startDate + " and " + endDate;
                }
                // reservation.start> dto.getStartDate && reservation.end < dto.getEndDate (start<startRes) && (end > endRes)
                if (reservation.getStartTime().compareTo(startDate) > 0 && reservation.getEndTime().compareTo(endDate) < 0) {
                    return "There are already exists a reservation on court " + dto.getCourtId() + " for " + startDate + " and " + endDate;
                }

            }
        }

        return "ok";
    }

    private void sendSubscriptionPaymentMail(Person owner, AddSubscriptionDto dto, String to
            , int price, String message) throws MessagingException, DocumentException {
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
        emailSenderService.sendMail(to, paymentSubscriptionSubject, message, true, multipart);

    }

    private DataSource computePdf(Person owner, AddSubscriptionDto dto, int price) throws DocumentException, MessagingException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk("Hello, " + owner.getName() + "! This is your email to confirm your subscription"));
        paragraph.add(new Chunk("Your subscription was successfully generated for " +
                "court with id:" + dto.getCourtId() + " for month: " +
                dto.getMonth() + " and between hours:" + dto.getStartHour() + " and " + dto.getEndHour()) + ".\n");
        paragraph.add(new Chunk("You need to pay:" + price));
        document.add(paragraph);
        document.close();
        byte[] bytes = outputStream.toByteArray();
        DataSource dataSource = new ByteArrayDataSource(bytes, "application/pdf");
        return dataSource;

    }
}
