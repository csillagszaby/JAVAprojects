package BusinessLayer;
import java.io.Serializable;
import java.util.Date;

public class Orderi implements Serializable {
	private static final long serialVersionUID = 1L;
	private int orderId;
	private Date data;
	private int table;
	
	public Orderi(int orderId, String table) {
		this.orderId = orderId;
		this.data = new Date();
		this.table = Integer.parseInt(table);
	}

	public String toString() {
		return "data: "+data+" , table: "+table;
	}
	public Date getData() {
		return data;
	}

	public int getTable() {
		return table;
	}

	public int getOrderId() {
		return orderId;
	}
	public void setTable(int table) {
		this.table=table;
	}

	public void setOrderId(int orderId) {
		this.orderId=orderId;
	}
	public int hashCode() {
		return (this.orderId+"").hashCode();
	}
	public boolean equals(Object obj) {
		if(obj!=null && obj instanceof Orderi) {
			int orderId2=((Orderi)obj).getOrderId();
			//Date data2=((Orderi)obj).getData();
			int table2=((Orderi)obj).getTable();
			if(orderId2==this.getOrderId() ) {
				return true;
			}
		}
		return false;
	}
}
/*
public V get(Object key) {
	if(key==NULL)
	
	int hash=hash(key.hashCode());
}

 V put(K key, V value)
 index = hash(hashCode(K))
*/