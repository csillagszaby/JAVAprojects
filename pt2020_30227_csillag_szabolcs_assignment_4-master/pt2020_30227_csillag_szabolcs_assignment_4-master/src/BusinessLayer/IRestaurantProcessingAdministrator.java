package BusinessLayer;

public interface IRestaurantProcessingAdministrator {
	public void addProduct(String name,double pret);
	public void deleteProduct(String name);
	public void modifyProduct(String name,double pret);
}
