package BusinessLayer;

import java.util.ArrayList;

public interface IRestaurantProcessingOspatar {
	public void addOrderAndElements(Orderi ord,ArrayList<MenuItem> items);
	public void computeBillForAnOrder(Orderi ord,ArrayList<MenuItem> items);
}
