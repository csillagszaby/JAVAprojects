package Main;

import java.io.IOException;

import DataAccess.DataAccess;
import Presentation.Presentation;

public class Start {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
				DataAccess connect =new DataAccess();
				Presentation p=new Presentation();
				p.start(connect,args[0]);//args[0]=test.txt
	}

}
//folderul model doar arata cum e construita baza de date
//tabel1: client(id,name,address)
//tabel2: product(id,name,quantity,price)
//tabel3: orderi (id, nameclient, nameproduct, quantity)
//tabel4: bill(id,nameclient,nameproduct,quantity,totalprice)