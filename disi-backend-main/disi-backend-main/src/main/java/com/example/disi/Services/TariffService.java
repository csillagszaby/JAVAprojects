package com.example.disi.Services;

import com.example.disi.DTOs.TariffDto;
import com.example.disi.Entities.Tariff;
import com.example.disi.Repositories.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TariffService {

    @Autowired
    TariffRepository tariffRepository;

    //made to exist just 1 tariff on DB
    public Boolean registerTariff(TariffDto tariffDto){

        if(tariffRepository.count()>0){
            Tariff t = tariffRepository.findAll().get(0);
            t.setDayTariff(tariffDto.getDayTariff());
            t.setNightTariff(tariffDto.getNightTariff());
            tariffRepository.save(t);
            return true;
        }else{
            Tariff t = new Tariff();
            t.setNightTariff(tariffDto.getNightTariff());
            t.setDayTariff(tariffDto.getDayTariff());
            tariffRepository.save(t);
            return true;
        }
    }

    public TariffDto getTariff(){
        Tariff t = tariffRepository.findAll().get(0);
        TariffDto tariffDto = new TariffDto();
        tariffDto.setDayTariff(t.getDayTariff());
        tariffDto.setNightTariff(t.getNightTariff());
        return tariffDto;
    }
}
