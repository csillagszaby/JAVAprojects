package PresentationLayer;

import java.awt.Color;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;

import BusinessLayer.MenuItem;
import BusinessLayer.Orderi;
import BusinessLayer.Restaurant;

public class ChefGrapicalUserInterface implements Observer {
    JFrame frame = new JFrame ("Chef");
	JTable table = new JTable();
	Object[] row = new Object[2];
	Object[] columns = {"Order","Products"};
    DefaultTableModel model = new DefaultTableModel();
	public ChefGrapicalUserInterface(Restaurant rest) {
        model.setColumnIdentifiers(columns);
        table.setModel(model);

        JScrollPane pane = new JScrollPane(table);
        frame.add(pane);
        
	      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	      frame.setSize(700, 500);
	      frame.setLocation(400, 150);
	      
	      for(Orderi ord:rest.getOrderi()) {
	    	  adaugareItem(ord,rest.getMapi().get(ord));
	      }
	}
	
    //observer
    @Override
    public void update(Orderi ord,ArrayList<MenuItem> items) {
        this.adaugareItem(ord,items);
    }
	
    public void adaugareItem(Orderi ord,ArrayList<MenuItem> items){
    		//intra
            row[0] = ord.toString();
            row[1] = "";
            for(MenuItem aux:items) {
            	row[1]+=aux.toString();
            } 
            model.addRow(row);
        
    }
	
}
