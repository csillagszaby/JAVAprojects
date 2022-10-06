import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.StringTokenizer;
public class SimulationManager implements Runnable{
	public int numberOfClients=4;
	public int numberOfServers=2;
	public int timeLimit=15; //maximum processing time
	public int minArrivalTime=2; 
	public int maxArrivalTime=10;
	public int minServiceTime=2; 
	public int maxServiceTime=4;
	float averageWaitingTime=0.0f;
	
	public SelectionPolicy selectionPolicy=SelectionPolicy.SHORTEST_TIME;
	
	//entity responsible with queue management and client distribution
	
	private Scheduler scheduler; 
	//pool of tasks(client shoping in the store)
	private ArrayList<Task> generatedTasks;
	PrintStream gchar;
	String afis="";
	Thread[] thread;
	
	public SimulationManager(String sInput,String sOutput) throws IOException {
		initializeaza(sInput,sOutput);
		thread=new Thread[numberOfServers];
		int i=0;
		scheduler=new Scheduler(numberOfServers,1500);
		for(Server aux:scheduler.getServers())
		{
			thread[i]=new Thread(aux);
			thread[i].setName("Queue"+i);
			thread[i].start();
			i++;
		}
		scheduler.changeStrategy(selectionPolicy);
		//initialize the scheduler
		//   =>creat and start the numberOfServers Threads
		//   =>initialize selectionstrategy=>creatStrategy
		
		//generatenrOfClients clients using generate NRandomTasks()
		//and store them to generatedTasks
		generateNRandomTasks();
	}
	public void initializeaza(String sInput,String sOutput) throws IOException {
		FileInputStream f=new FileInputStream(sInput);
		InputStreamReader fchar=new InputStreamReader(f);
		BufferedReader buf=new BufferedReader(fchar);
		String linie;StringTokenizer t;
		
		linie=buf.readLine();
		numberOfClients=Integer.parseInt(linie);
		linie=buf.readLine();
		numberOfServers=Integer.parseInt(linie);
		linie=buf.readLine();
		timeLimit=Integer.parseInt(linie);
		linie=buf.readLine();
		t=new StringTokenizer(linie);
		minArrivalTime=Integer.parseInt(t.nextToken());
		maxArrivalTime=Integer.parseInt(t.nextToken());
		linie=buf.readLine();
		t=new StringTokenizer(linie);
		minServiceTime=Integer.parseInt(t.nextToken());
		maxServiceTime=Integer.parseInt(t.nextToken());
		fchar.close();
		
		FileOutputStream g=new FileOutputStream(sOutput);
		gchar=new PrintStream(g);

	}
	public void generateNRandomTasks() {
		//generate n random tasks
		// -random processing time
		// minprocessingtime< processingtime<maxprocessingtime
		//random arrival time
		//sort list with respect to arrival time
		generatedTasks=new ArrayList<Task>();
		for(int i=0;i<numberOfClients;i++)
		{
			Task aux=new Task(i+1,minArrivalTime,maxArrivalTime,minServiceTime,maxServiceTime);
			generatedTasks.add(aux);
		}
		//Collections.sort(names, Collections.reverseOrder());
		//generatedTasks.sort((t1, t2) -> t1.getArrivalTask() - t2.getArrivalTask());
		Collections.sort(generatedTasks);
	}
	
	//iterate generatedTasks list and pick tasks that have the arrivalTime
	//equal with the currentTime
	//   -send Task to queue by caling the dispatchTask method from Sheduler
	//   --delete client from list
	//@Override
	public void run() {
		int currentTime=0;
		while(currentTime<timeLimit){  afis="";
			while(!generatedTasks.isEmpty() && generatedTasks.get(0).getArrivalTask()==currentTime) {
				scheduler.disPatchTask(generatedTasks.get(0));
				generatedTasks.remove(0);
			}
			afis+="Time: "+currentTime+""+"\nWaiting Clients: ";
			for(Task aux:generatedTasks) {
				afis+=""+aux;
			}
			afis+="\n";
			int i=1;
			for(Server aux:scheduler.getServers())
			{
				afis+="Queue "+i+": ";
				if(aux.getWaitingPeriod().get()==0) {
					afis+="closed";
				}
				else {
					aux.incrementeazaPer();
					afis+=""+aux;
				}
				afis+="\n";
				i++;
			}// update ui frame
			currentTime++;
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {	// TODO Auto-generated catch block
				e.printStackTrace();
			}//wait an interval of 1 second
			gchar.println(afis);
			if(generatedTasks.isEmpty()) {
				int ok=1;
				for(Server aux:scheduler.getServers()) {
					if(aux.getWaitingPeriod().get()!=0) {
						ok=0;break;
					}
				}
				if(ok==1) break;
			}
		}
		int i=0;
		for(Server aux:scheduler.getServers()) {
			averageWaitingTime+=aux.getWaitingPerServer()+aux.getWaitingPeriod().get();
			thread[i].stop();
		}
		averageWaitingTime/=numberOfClients;
		afis="Average waiting time "+averageWaitingTime+"\n";
		gchar.println(afis); gchar.close();
	}
	
	public static void main(String[] args) throws IOException {
		SimulationManager gen=new SimulationManager(args[0],args[1]);
		Thread t=new Thread(gen);
		t.start();
	}
}
