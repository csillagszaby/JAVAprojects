package DataAccess;
import java.sql.*;

public class DataAccess {
	
	private Connection con;
	private Statement st;
	private ResultSet rs;
	
	public DataAccess() {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			con=DriverManager.getConnection("jdbc:mysql://localhost/test","root","");
			st=con.createStatement();
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	public double order(String nume,String product,int quantity) {
		try {
			String insertion="INSERT INTO orderi (id, nameclient, nameproduct, quantity) VALUES (NULL, '"+nume+"', '"+product+"', '"+quantity+"')";
			st.executeUpdate(insertion);
			
			String query="SELECT quantity,price FROM product WHERE name='"+product+"' ";
			rs=st.executeQuery(query);
			rs.next();
			int quantityold=rs.getInt("quantity");
			double plata=rs.getDouble("price");
			int quantitynew=quantityold-quantity;
			if(quantitynew<0) {
				return 0.0;
			}
			String modific="UPDATE product SET quantity = '"+quantitynew+"' WHERE name = '"+product+"' ";
			st.executeUpdate(modific);
			
			return plata;
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
		return 0.0;
	}
	public void insereazaClient(String nume,String address) {
		try {
			String insertion="INSERT INTO client(id,name,address) VALUES(NULL,'"+nume+"','"+address+"')";
			st.executeUpdate(insertion);
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	public void insereazaBill(String numeclient,String numeprodus,int quantity,double price) {
		try {
			String insertion="INSERT INTO bill(id,nameclient,nameproduct,quantity,totalprice) VALUES(NULL,'"+numeclient+"','"+numeprodus+"','"+quantity+"','"+price+"')";
			st.executeUpdate(insertion);
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	public void insereazaProduct(String nume,int quantity,double price) {
		try {
			rs=st.executeQuery("SELECT quantity FROM product WHERE name='"+nume+"'");
			if(rs.next()) {
				int aux=rs.getInt("quantity");
				aux+=quantity;
				st.executeUpdate("UPDATE product SET quantity = '"+aux+"' WHERE name = '"+nume+"' ");
			}
			else {
				String insertion="INSERT INTO product(id,name,quantity,price) VALUES(NULL,'"+nume+"','"+quantity+"','"+price+"')";
				st.executeUpdate(insertion);
			}
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	public void deleteClient(String nume,String address) {
		try {
			String sterge="DELETE FROM client WHERE name='"+nume+"' AND address='"+address+"' ";
			st.execute(sterge);
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	public void deleteProduct(String nume) {
		try {
			String sterge="DELETE FROM product WHERE name='"+nume+"'";
			st.execute(sterge);
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
	}
	
	public String reportClient() {
		try {
			String s="";
			String query="SELECT * FROM client";
			rs=st.executeQuery(query);
			while(rs.next()) {
				int id=rs.getInt("id");
				String name=rs.getString("name");
				String address=rs.getString("address");
				s+="id: "+id+" name: "+name+" address: "+address+"\n";
			}
			return s;
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
		return "";
	}
	public String reportProduct() {
		try {
			String s="";
			String query="SELECT * FROM product";
			rs=st.executeQuery(query);
			while(rs.next()) {
				int id=rs.getInt("id");
				String name=rs.getString("name");
				int quantity=rs.getInt("quantity");
				int price=rs.getInt("price");
				s+="id: "+id+" nameproduct: "+name+" quantity: "+quantity+" price: "+price+"\n";
			}
			return s;
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
		return "";
	}
	public String reportOrder() {
		try {
			String s="";
			String query="SELECT * FROM orderi";
			rs=st.executeQuery(query);
			while(rs.next()) {
				int id=rs.getInt("id");
				String name=rs.getString("nameclient");
				String product=rs.getString("nameproduct");
				int quantity=rs.getInt("quantity");
				s+="id: "+id+" nameclient:"+name+" product: "+product+" quantity: "+quantity+"\n";
			}
			return s;
			
		} catch(Exception e) {
			System.out.println("error: "+e);
		}
		return "";
	}

}
