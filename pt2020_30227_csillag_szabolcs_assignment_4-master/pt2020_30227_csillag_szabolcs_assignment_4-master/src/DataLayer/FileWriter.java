package DataLayer;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import BusinessLayer.MenuItem;
import BusinessLayer.Orderi;

public class FileWriter {
	public FileWriter()  {
		
	}
	public void computeBill(Orderi ord,ArrayList<MenuItem> items) throws IOException {
		//System.out.println(ord+""+items+"");
		File bill=new File("bill.txt");
		
		if(!bill.exists()) {
			bill.createNewFile();
		}
		
		PrintWriter pw=new PrintWriter(bill);
		pw.println("table:"+ord.getTable());
		double total=0.0;
		for(MenuItem aux:items) {
			total+=aux.computePrice();
			pw.println(aux);
		}
		pw.println("Suma totala: "+total);
		pw.close();
	}
}
