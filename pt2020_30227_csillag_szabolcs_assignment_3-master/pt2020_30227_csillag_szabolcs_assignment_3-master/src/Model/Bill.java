package Model;

public class Bill {
	private String nameclient;
	private String nameproduct;
	private int quantity;
	private double totalprice;
	
	/*
	public Bill(String nameclient,String nameproduct,int quantity,double totalprice) {
		this.nameclient=nameclient;
		this.nameproduct=nameproduct;
		this.quantity=quantity;
		this.totalprice=totalprice;
	}
	*/
}
//tabel1: client(id,name,address)
//tabel2: product(id,name,quantity,price)
//tabel3: orderi (id, nameclient, nameproduct, quantity)
//tabel4: bill(id,nameclient,nameproduct,quantity,totalprice)