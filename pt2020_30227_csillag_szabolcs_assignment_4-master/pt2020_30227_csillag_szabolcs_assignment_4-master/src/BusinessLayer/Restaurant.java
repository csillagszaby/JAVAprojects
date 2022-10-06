package BusinessLayer;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import DataLayer.FileWriter;
import DataLayer.RestaurantSerializator;

public class Restaurant extends Observable implements IRestaurantProcessingAdministrator ,Serializable, IRestaurantProcessingOspatar {
	private static final long serialVersionUID = 1L;
	private ArrayList<MenuItem> menuItems;
	private ArrayList<Orderi> orderi;
	private Map<Orderi,ArrayList<MenuItem>> mapi;
	private RestaurantSerializator rs;
	
	public Restaurant() {
		mapi=new HashMap<Orderi,ArrayList<MenuItem>>();
		menuItems=new ArrayList<MenuItem>();
		orderi=new ArrayList<Orderi>();
	}
	
	
	public ArrayList<MenuItem> getMenuItems() {
		return menuItems;
	}
	public void setRS(RestaurantSerializator rs) {
		this.rs=rs;
	}


	public Map<Orderi, ArrayList<MenuItem>> getMapi() {
		return mapi;
	}
	public ArrayList<Orderi> getOrderi() {
		return orderi;
	}

	public void setMapi(Map<Orderi, ArrayList<MenuItem>> mapi) {
		this.mapi = mapi;
	}
	public void addProduct2(MenuItem product) {
		menuItems.add(product);
	}

	@Override
	public void addProduct(String name,double price) {
		menuItems.add(new BaseProduct(name,price));
		rs.serializare(this);
	}

	@Override
	public void deleteProduct(String name) {
		MenuItem aux2=null;
		for(MenuItem aux:menuItems) {
			if(aux.getName().equals(name));
			aux2=aux;
			break;
		}
		menuItems.remove(aux2);
		rs.serializare(this);
		//System.out.println(menuItems);
	}

	@Override
	public void modifyProduct(String name,double pret) {
		for(MenuItem aux:menuItems) {
			if(aux.getName().equals(name)) {
				aux.setPret(pret);
				break;
			}
		}
		rs.serializare(this);
	}

	@Override
	public void addOrderAndElements(Orderi ord,ArrayList<MenuItem> items) {
		//adaugare din lista
		orderi.add(ord);
		mapi.put(ord,items);
		//notificare chef
		this.seter(ord, items);
		rs.serializare(this);
	}

	@Override
	public void computeBillForAnOrder(Orderi ord,ArrayList<MenuItem> items) {
		// TODO Auto-generated method stub
		FileWriter fw=new FileWriter();
		try {
			fw.computeBill(ord,items);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//mapi.remove(ord);
		//orderi.remove(ord);
		rs.serializare(this);
	}
	
	public String toString() {
		String s="";
		for(MenuItem aux:menuItems) {
			s+=aux.toString();
		}
		return s;
	}
}