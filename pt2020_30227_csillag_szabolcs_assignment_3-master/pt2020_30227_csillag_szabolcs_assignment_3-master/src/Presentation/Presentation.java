package Presentation;

import java.io.File;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Scanner;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import BusinessLogic.BusinessLogic;
import DataAccess.DataAccess;

public class Presentation {

	private static int nr_order=0,nr_client=0,nr_product=0;
	
	public Presentation() {
		
	}
	
	public void start(DataAccess db,String fisier) throws IOException {
		
		File file=new File(fisier);
		Scanner scan=new Scanner(file);
		
		String linie;
		String[] spliti;
		while(scan.hasNextLine()) {
			linie=scan.nextLine();
			spliti=linie.split(":");
			if(spliti[0].equals("Report client")) {
				nr_client++;
				scrierePdf("ReportClient"+nr_client,db.reportClient());
			}
			else if(spliti[0].equals("Report product")) {
				nr_product++;
				scrierePdf("ReportProduct"+nr_product,db.reportProduct());
			}
			else if(spliti[0].equals("Report order")) {
				nr_order++;
				scrierePdf("ReportOrder"+nr_order,db.reportOrder());
			}
			else {
				BusinessLogic.verific(db,spliti[0],spliti[1]); 
			}
		}
		scan.close();
	}
	public static void scrierePdf(String nume,String continut) {
		try {
			Document document=new Document();
			PdfWriter writer=PdfWriter.getInstance(document,new FileOutputStream(nume+".pdf"));
			document.open();
			document.add(new Paragraph(continut));
			document.close();
			writer.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
}