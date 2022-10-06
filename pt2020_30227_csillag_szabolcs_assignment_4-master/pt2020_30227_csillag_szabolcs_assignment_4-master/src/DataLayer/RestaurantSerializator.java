package DataLayer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import BusinessLayer.Restaurant;

public class RestaurantSerializator implements Serializable {
	private static final long serialVersionUID = 1L;
	//deserializare
	public Restaurant deserializare() {
		Restaurant rest;
		try {
			File f=new File("fisieri.txt");
			FileInputStream fis = new FileInputStream(f);
			ObjectInputStream ois = new ObjectInputStream(fis);
			rest = (Restaurant)ois.readObject(); 
			ois.close();
			fis.close();
		}catch(Exception e) {
			rest=null;
		}
		return rest;
	}
	
	//serializare
	public void serializare(Restaurant rest) {
		try {
			File f=new File("fisieri.txt");
			FileOutputStream fos = new FileOutputStream (f);
			ObjectOutputStream oos = new ObjectOutputStream(fos);
			oos.writeObject(rest); // Method for serialization of object
			oos.close();
			fos.close();
		}catch(Exception e) {
			System.out.println("nu ajungem aici");
		}
	}
	
}
