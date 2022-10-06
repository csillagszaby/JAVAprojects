package com.example.disi.Services;

import com.example.disi.DTOs.*;
import com.example.disi.DTOs.Court.AvailabilityStatusDto;
import com.example.disi.DTOs.Court.SearchCourtDto;
import com.example.disi.Entities.*;
import com.example.disi.Repositories.CourtRepository;
import com.example.disi.Repositories.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourtService {


    private final CourtRepository courtRepository;
    private final LocationRepository locationRepository;
    private final ReservationService reservationService;
    private final SubscriptionCalendarService subscriptionCalendarService;
    private final SubscriptionService subscriptionService;
    private static final List<String> hours = Arrays.asList("00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23");

    public String addCourt(AddCourtDto dto) {

        Location location = locationRepository.findFirstById(dto.getLocationId());
        if (location == null) {
            return "Location having id=" + dto.getLocationId() + " not found";
        }
        Court court = courtRepository.findFirstByLocationAndNumber(location, dto.getNumber());
        if (court != null) {
            return "Already exists a court";
        }
        court = Court.builder().location(location).number(dto.getNumber()).build();
        courtRepository.save(court);
        return "succes";
    }

    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }

    @Transactional
    public String updateCourt(UpdateCourtDto dto) {
        Location location = locationRepository.findFirstById(dto.getLocationId());
        if (location == null) {
            return "Location with id " + dto.getLocationId() + " does not exist";
        }
        Court court = courtRepository.findFirstById(dto.getId());
        if (court == null) {
            return "Court with id " + dto.getId() + " does not exist";
        }
        court.setLocation(location);
        court.setNumber(dto.getNumber());
        return "Succes";


    }

    public String deleteCourt(Long idCourt) {
        Court court = courtRepository.findFirstById(idCourt);
        if (court == null) {
            return "Court with id " + idCourt + " does not exist";
        }
        courtRepository.delete(court);
        return "Succes";
    }

    public ResponseEntity getCourtsForLocation(Long idLocation) {
        Location location = locationRepository.findFirstById(idLocation);
        if (location == null) {
            return new ResponseEntity("Unfind", HttpStatus.OK);
        }

        List<Court> courts = courtRepository.findAll();
        List<Court> returnedCourts = courts.stream().filter(e -> e.getLocation().equals(location)).collect(Collectors.toList());
        return new ResponseEntity<>(returnedCourts, HttpStatus.OK);
    }


    public List<CourtDto> availableCourts(TimeRangeDto c) {
        List<CourtDto> courtDtos = new ArrayList<>();
        List<Court> courts = courtRepository.findAll();
        List<ReservationDto> reservationDtoers = reservationService.findAllReservation();
        List<SubscriptionCalendarDto> subscriptionCalendarDtos = subscriptionCalendarService.findAll();

        //If the sent time range overlaps with any rezervation or subscription then when delete
        //the reserved Court from the free courts list
        for (ReservationDto r : reservationDtoers) {
            if (r.getEndTime().after(c.getStartTime()) && r.getStartTime().before(c.getEndTime())) {
                courts.remove(r.getCourt());
            }
        }
        for (SubscriptionCalendarDto s : subscriptionCalendarDtos) {
            if (s.getEndDate().after(c.getStartTime()) && s.getStartDate().before(c.getEndTime())) {
                courts.remove(s.getSubscription().getCourt());
            }
        }


        for (Court court : courts) {
            CourtDto dto = CourtDto.builder()
                    .id(court.getId())
                    .location(court.getLocation())
                    .number(court.getNumber())
                    .build();
            courtDtos.add(dto);

        }

        return courtDtos;
    }

    public List<AvailabilityStatusDto> seeCourtAvailability(SearchCourtDto dto) {

        Court court = courtRepository.findFirstById(dto.getCourtId());
        if (court == null) {
            return null;
        }
        List<AvailabilityStatusDto> result = new ArrayList<>();
        String s = new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH).format(dto.getStartDate());
        String monthName = new SimpleDateFormat("MMMM", Locale.ENGLISH).format(dto.getStartDate());
        // Get all subscriptions for a specific court
        List<Subscription> subscriptionList = subscriptionService.getSubscriptionsForCourt(court);
        subscriptionList = subscriptionList.stream().filter(e -> e.getMonth().equals(monthName)).collect(Collectors.toList());

        // Get all reservations for a specific court
        List<Reservation> reservationList1 = reservationService.getReservationsFromCourt(court);
        // Filter reservations for a court by date (get all reservations from a specific date)
        reservationList1 = reservationList1.stream().filter(e -> new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH).format(e.getStartTime()).equals(s)).collect(Collectors.toList());

        // For every hour from a day [0,1,..,23]
        for (String ss : hours) {
            try {
                Date date = new SimpleDateFormat("dd MMMM yyyy HH", Locale.ENGLISH).parse(s + " " + ss);
                // Check if there is no reservation
                Boolean checkRes = checkReservation(reservationList1, date);
                // Check if there is no subscription
                Boolean checkSub = checkSubscription(court, s,Integer.parseInt(ss));
                Boolean status;
                if (checkSub == true && checkRes == true) {
                    status = false;
                } else {
                    status = true;
                }
                result.add(AvailabilityStatusDto.builder().status(status).hour(ss).build());
            } catch (ParseException e) {
                e.printStackTrace();
            }

        }
        return result;
    }

    private Boolean checkReservation(List<Reservation> reservationList, Date date) {
        for (Reservation reservation : reservationList) {
            if (reservation.getStartTime().compareTo(date) <= 0 && (reservation.getEndTime().compareTo(date) > 0)) {
                return false;
            }
        }

        return true;
    }

    private Boolean checkSubscription(Court court, String s, int startHour) {
        List<SubscriptionCalendarDto> subscriptionCalendars = subscriptionCalendarService.findAll().stream().
                filter(e -> e.getSubscription().getCourt().equals(court) && (new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH).format(e.getStartDate()).equals(s)))
                .collect(Collectors.toList());
        int count = 0;
        for (SubscriptionCalendarDto temp : subscriptionCalendars) {

            int startHourSubscription = Integer.parseInt(temp.getSubscription().getStartHour());
            int endHourSubscription = Integer.parseInt(temp.getSubscription().getEndHour());
            if (startHour >= startHourSubscription && startHour < endHourSubscription) {
                count++;
            }

        }
        if(count==0){
            return true;
        }
        return false;
    }


}
