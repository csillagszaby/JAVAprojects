import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

public class Server implements Runnable {
	private BlockingQueue<Task> Tasks;
	private AtomicInteger waitingPeriod;
	private int waitingPerServer=0;
	
	public Server() {
		//initializare queue si waitingPeriod
		Tasks=new ArrayBlockingQueue<Task>(150);
		waitingPeriod=new AtomicInteger(0);
		//
	}
	
	public void addTask(Task newTask) {
		Tasks.add(newTask);
		//add Task to queue
		//System.out.println("na aia e" +newTask.getProcessingPeriod());
		waitingPeriod.addAndGet(newTask.getProcessingPeriod());
		//imcrement the waiting period
	}
	
	//@Override
	public void run() {
		while(true) {
			try {
				Thread.sleep(1000);
				if(!Tasks.isEmpty()) {
					waitingPeriod.decrementAndGet();
					Tasks.element().decrementeazaProces();
					if(Tasks.element().getProcessingPeriod()==0){
						waitingPerServer+=Tasks.take().getWaitingPer();
					}
				}
			} catch (InterruptedException e) {
				//e.printStackTrace();
				System.out.println("ceva eroare");
			}
			//take next task from queue
			//stop the thread for a time equal with the task's processing time 
			//decrement the waitingPeriod
		}
	}
	//public Task[] getTasks() {
	//}
	public String toString() {
		String s="";
		for(Task aux2:Tasks) {
			s+=aux2;
		}
		return s;
	}
	public AtomicInteger getWaitingPeriod() {
		return waitingPeriod;
	}
	public void incrementeazaPer() {
		for(Task aux2:Tasks) {
			aux2.incrementeazaPer();
		}
	}
	public int getWaitingPerServer() {
		return waitingPerServer;
	}
}
