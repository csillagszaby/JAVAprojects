import java.util.ArrayList;
import java.util.List;

public class Scheduler {
	private List<Server> servers;
	private int maxNoServers;
	private int maxTasksPerServer;
	private Strategy strategy;
	
	public Scheduler(int maxNoServers,int maxTaskPerServer) {
		servers=new ArrayList<Server>(maxNoServers);
		this.maxNoServers=maxNoServers;
		this.maxTasksPerServer=maxTaskPerServer;
		for(int i=0;i<maxNoServers;i++)
		{
			Server r = new Server();
			//Thread q1 = new Thread(r);
			//q1.start();
			servers.add(r);
		}
		//for maxnoServers
		//--creat server object
		//--creat thread with the object
	}
	
	public void changeStrategy(SelectionPolicy policy) {
		//apply strategy patern , instantiate the strategy with the concrete
		//strategy coresponding to policy
		if(policy==SelectionPolicy.SHORTEST_QUEUE) {
			strategy=new ConcreteStrategyQueue();
		}
		if(policy==SelectionPolicy.SHORTEST_TIME) {
			strategy=new ConcreteStrategyTime();
		}
	}
	
	public void disPatchTask(Task t) {
		//call the strategy addTask method
		strategy.addTask(servers,t);
	}
	public List<Server> getServers() {
		return servers;
	}

}
