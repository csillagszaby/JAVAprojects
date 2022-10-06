package PresentationLayer;

import java.util.ArrayList;

import BusinessLayer.MenuItem;
import BusinessLayer.Orderi;

public interface Observer {
	public void update(Orderi ord,ArrayList<MenuItem> items);
}
