package BusinessLayer;

import java.io.Serializable;

public class BaseProduct implements MenuItem,Serializable {
 
    private double pret;
    private String name;
 
    @Override
    public String toString() {
        return name +": "+this.computePrice()+" lei ; ";
        //getClass().getSimpleName() ar fi BaseProduct
    }
    @Override
    public double computePrice() {
    	return pret;
    }
    @Override
    public String getName() {
    	return name;
    }
    public BaseProduct(String name,double pret) {
		this.pret = pret;
		this.name = name;
	}
    //leaf
	public void setPret(double pret) {
		this.pret = pret;
	}

	public void setName(String name) {
		this.name = name;
	}
    // standard constructor, getters, setters
}