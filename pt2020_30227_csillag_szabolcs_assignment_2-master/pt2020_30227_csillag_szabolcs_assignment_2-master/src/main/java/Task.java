import java.util.Random;

public class Task implements Comparable<Task>{
	private int id;
	private int arrivalTask;
	private int processingPeriod;
	private int waitingPer;
	
	public Task() {
		
	}
	public Task(int id,int arrival_min,int arrival_max,int service_min,int service_max)
	{
		Random r=new Random();
		this.id=id;
		this.arrivalTask=r.nextInt(arrival_max - arrival_min + 1) +arrival_min;
		this.processingPeriod=r.nextInt(service_max - service_min + 1) +service_min;
		waitingPer=0;
	}
	public String toString()
	{
		return "("+id+","+arrivalTask+","+processingPeriod+");";
	}
	public int getProcessingPeriod() {
		return processingPeriod;
	}
	public int getArrivalTask() {
		return arrivalTask;
	}
	public void decrementeazaProces() {
		processingPeriod--;
	}
	public void incrementeazaPer() {
		waitingPer++;
	}
	public int getWaitingPer() {
		return waitingPer;
	}
	//@Override
	public int compareTo(Task t) {
	    return this.arrivalTask - t.getArrivalTask();
	}
}
