package BusinessLogic;

import DataAccess.DataAccess;

import Presentation.Presentation;

public class BusinessLogic {
	private static int i=0;
	private static String[] valori;
	
	public static void verific(DataAccess db,String sir1,String sir2) {
		if(sir1.equals("Insert client")) {
			valori=sir2.split(",");
			db.insereazaClient(valori[0].trim(),valori[1].trim());
		}
		else if(sir1.equals("Delete client")) {
			valori=sir2.split(",");
			db.deleteClient(valori[0].trim(),valori[1].trim());
		}
		else if(sir1.equals("Insert product")) {
			valori=sir2.split(",");
			db.insereazaProduct(valori[0].trim(),Integer.valueOf(valori[1].trim()),Double.parseDouble(valori[2].trim()));
		}
		else if(sir1.equals("Delete product")) {
			db.deleteProduct(sir2.trim());
		}
		else if(sir1.equals("Order")) {
			valori=sir2.split(",");
			double plata=db.order(valori[0].trim(),valori[1].trim(),Integer.valueOf(valori[2].trim()));
			String continut="";
			if(plata==0.0) {
				continut+="Acest order nu se poate efectua, pentru ca nu este in stoc cantitatea ceruta";
			}
			else {
				continut+="Numeclient: "+valori[0].trim()+"\nNumeprodus: "+valori[1].trim()+"\nCantitatea ceruta: "+Integer.valueOf(valori[2].trim());
				continut+="\nPretul unui produs respectiv: "+plata;
				plata=plata*Integer.valueOf(valori[2].trim());
				continut+="\nPlata totala: "+plata;
				db.insereazaBill(valori[0].trim(),valori[1].trim(),Integer.valueOf(valori[2].trim()),plata);
			}
			i++;
			String nume="Order"+i;
			Presentation.scrierePdf(nume, continut);
		}
	}
}
