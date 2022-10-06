package PresentationLayer;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import BusinessLayer.Restaurant;

public class AdministratorGraphicalUserInterface {
	//... Components
    private JTextField userInputName1 = new JTextField(20);
    private JTextField userInputPrice1 = new JTextField(10);
    private JButton    adaugare = new JButton("add");
    private JButton    stergere = new JButton("delete");
    private JButton    modify = new JButton("modify");
    JFrame frame = new JFrame ("Administrator");
    
    //======================================================= constructor
    /** Constructor */
    public AdministratorGraphicalUserInterface(Restaurant rest) {
    	
    	frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    	frame.setSize(700, 500);
    	frame.setLocation(400, 150);
        
        //... Layout the components.      
        JPanel content1 = new JPanel();
        content1.setLayout(new FlowLayout());
        content1.add(new JLabel("Nume:"));
        content1.add(userInputName1);
        content1.add(new JLabel("Pret:"));
        content1.add(userInputPrice1);
        
        JPanel operatie=new JPanel();
        operatie.setLayout(new FlowLayout());
        operatie.add(adaugare);
        operatie.add(stergere);
        operatie.add(modify);
        
        JPanel observatie = new JPanel();
        observatie.add(new JLabel("Pentru stergere e destul numele."));
        observatie.add(new JLabel("Pentru modificare se va modifica produsul numelui cerut cu pretul respectiv"));
        
        JPanel p = new JPanel();
   		p.add(content1);
   		p.add(operatie);
   		p.add(observatie);
   		p.setLayout(new BoxLayout(p, BoxLayout.Y_AXIS));
        
   		adaugare.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e) {
            	rest.addProduct(userInputName1.getText(),Double.parseDouble(userInputPrice1.getText()));
                
            }
        });
   		stergere.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e) {
              rest.deleteProduct(userInputName1.getText());
            }
        });
   		modify.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e) {
            	rest.modifyProduct(userInputName1.getText(),Double.parseDouble(userInputPrice1.getText()));
            }
        });
   		
   		frame.setContentPane(p);
    }
}
