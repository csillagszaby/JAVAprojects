package BusinessLayer;

import java.io.Serializable;

public interface MenuItem extends Serializable{
	public double computePrice();
	public void setPret(double pret);
	public String toString();
	public String getName();
}
