package BusinessLayer;

import java.io.IOException;

import DataLayer.RestaurantSerializator;
import PresentationLayer.AdministratorGraphicalUserInterface;
import PresentationLayer.ChefGrapicalUserInterface;
import PresentationLayer.Controller;
import PresentationLayer.WaiterGrapicalUserInterface;

public class MainClass {

	public static void main(String[] args) throws ClassNotFoundException, IOException {
		// TODO Auto-generated method stub
		/*
		Restaurant restaurant=new Restaurant();
		MenuItem apa = new BaseProduct("apa",3);
        MenuItem lamaie = new BaseProduct("lamaie",5);
 
        CompositeProduct limonada = new CompositeProduct("limonada",0);
 
        limonada.addProduct(apa);
        limonada.addProduct(lamaie);
        
        restaurant.addProduct2(apa);
        restaurant.addProduct2(lamaie);
        restaurant.addProduct2(limonada);
		*/
        RestaurantSerializator rs=new RestaurantSerializator();
        Restaurant rest=rs.deserializare();
        rest.setRS(rs);
        //System.out.println(rest); 
        Controller cc=new Controller(rest);
        //Restaurant observable = new Restaurant();
		//ChefGrapicalUserInterface observer = new ChefGrapicalUserInterface();
		 
		//observable.addObserver(observer);
		//observable.setNews("newsi");
        
		//System.out.println(observer.getNews());
		
		rs.serializare(rest);
	}

}
