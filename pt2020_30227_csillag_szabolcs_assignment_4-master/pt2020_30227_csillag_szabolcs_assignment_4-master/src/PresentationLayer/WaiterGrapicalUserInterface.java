package PresentationLayer;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

import javax.swing.JButton;
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

public class WaiterGrapicalUserInterface {
	//... Components
	private static int contor;
    private JTextField userInputTable = new JTextField(10);
    private ArrayList<MenuItem> itemsi;
    private JButton    orderNow = new JButton("Order");
    private JButton    bill = new JButton("computeBill");
    private JLabel  label1=new JLabel("Table:");
    JFrame frame = new JFrame ("Waiter");
    JTable table = new JTable();
	Object[] row =new Object[1];
	Object[] columns = {"Products"};
    DefaultTableModel model = new DefaultTableModel();

    //======================================================= constructor
    /** Constructor */
    public WaiterGrapicalUserInterface(Restaurant rest) {
    	contor=0;
    	itemsi=new ArrayList<MenuItem>();
    	frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    	frame.setSize(700, 500);
    	frame.setLocation(400, 150);
        
    	model.setColumnIdentifiers(columns);
        table.setModel(model);


        JScrollPane pane = new JScrollPane(table);
        JPanel content2 = new JPanel();
        content2.add(label1);
        content2.add(userInputTable);
        content2.add(orderNow);
        content2.add(bill);
        JPanel pan = new JPanel();
        pan.add(pane);
        pan.add(content2);
        frame.setContentPane(pan);
   		bill.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e) {
            	//trebe
            	Orderi ord=new Orderi(contor,userInputTable.getText());
                rest.computeBillForAnOrder(ord,itemsi);
            }
        });
   		orderNow.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e) {
              Orderi ord=new Orderi(contor,userInputTable.getText());
              rest.addOrderAndElements(ord, itemsi);
              contor++;
            }
        });
   		table.addMouseListener(new MouseAdapter(){
   	        
   	        @Override
   	        public void mouseClicked(MouseEvent e){
   	            
   	            // i = the index of the selected row
   	            int i = table.getSelectedRow();
   	            itemsi.add((MenuItem) model.getValueAt(i,0));
   	        }
   	        });
   		//bag in tabel
   		adaugareItem(rest.getMenuItems());
    }
    public void adaugareItem(ArrayList<MenuItem> items){
        
    	for(MenuItem aux:items) {
	        row[0] = aux ;
	        // add row to the model
	        model.addRow(row);
    	}
    }
}
