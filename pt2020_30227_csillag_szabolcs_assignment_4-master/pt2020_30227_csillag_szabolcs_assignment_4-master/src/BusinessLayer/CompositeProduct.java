package BusinessLayer;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CompositeProduct implements MenuItem,Serializable {
    private double pret;
    private String name;
 
    private List<MenuItem> childItems;
	 
    public CompositeProduct(String name,double pret ) {
        this.pret = pret;
        this.name = name;
        this.childItems = new ArrayList<>();
    }
    @Override
    public String getName() {
    	return name;
    }
    @Override
	public double computePrice() {
		return pret;
	}
    @Override
	public String toString() {
		String s=name + ": "+computePrice()+" lei ; ";
		//for(MenuItem aux:childItems) {
			//s+="   "+aux.toString();
		//}
		return s;
	}
	 
    public void addProduct(MenuItem product) {
        childItems.add(product);
        pret+=product.computePrice();
    }
	 
    public void removeProduct(MenuItem product) {
        childItems.remove(product);
        pret-=product.computePrice();
    }
	public void setPret(double pret) {
		this.pret = pret;
	}

	public void setName(String name) {
		this.name = name;
	}
}
