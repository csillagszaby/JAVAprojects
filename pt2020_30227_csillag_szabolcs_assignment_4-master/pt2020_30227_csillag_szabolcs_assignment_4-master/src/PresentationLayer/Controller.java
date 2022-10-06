package PresentationLayer;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

import BusinessLayer.Restaurant;

public class Controller {
	  private AdministratorGraphicalUserInterface admin;
	  private WaiterGrapicalUserInterface waiter;
	  private ChefGrapicalUserInterface chef;
	  private JButton    btnAdmin = new JButton("Admin");
	  private JButton    btnWaiter = new JButton("Waiter");
	  private JButton    btnChef = new JButton("Chef");
	  JFrame frame = new JFrame ("Restaurant");
	  //Constructor
	  public Controller(Restaurant rest) {
	      admin=new AdministratorGraphicalUserInterface(rest);
	      waiter=new WaiterGrapicalUserInterface(rest);
	      chef=new ChefGrapicalUserInterface(rest);
	      rest.addObserver(chef);
	      
	      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	      frame.setSize(700, 500);
	      frame.setLocation(400, 150);
	        
	        JPanel operatie=new JPanel();
	        operatie.setLayout(new FlowLayout());
	        operatie.add(btnAdmin);
	        operatie.add(btnWaiter);
	        operatie.add(btnChef);
	        
	        JPanel observatie = new JPanel();
	        observatie.add(new JLabel("Selectati una"));
	        
	        JPanel p = new JPanel();
	   		p.add(operatie);
	   		p.add(observatie);
	   		p.setLayout(new BoxLayout(p, BoxLayout.Y_AXIS));
	        
	   		btnAdmin.addActionListener(new ActionListener(){
	            @Override
	            public void actionPerformed(ActionEvent e) {
	               frame.setVisible(false);
	               admin.frame.setVisible(true);
	            }
	        });
	   		btnWaiter.addActionListener(new ActionListener(){
	            @Override
	            public void actionPerformed(ActionEvent e) {
	            	frame.setVisible(false);
		            waiter.frame.setVisible(true);
	            }
	        });
	   		btnChef.addActionListener(new ActionListener(){
	            @Override
	            public void actionPerformed(ActionEvent e) {
	            	frame.setVisible(false);
		            chef.frame.setVisible(true);
	            }
	        });
	   		
	   		frame.setContentPane(p);
	   		frame.setVisible(true);
	  }
}
