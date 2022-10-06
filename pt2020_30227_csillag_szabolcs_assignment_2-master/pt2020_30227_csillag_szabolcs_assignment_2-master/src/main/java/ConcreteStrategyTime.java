import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
public class ConcreteStrategyTime implements Strategy {

	//@Override
	public void addTask(List<Server> servers, Task t) {
		// TODO Auto-generated method stub
		
		int mini=9999;
		for(Server aux3:servers) {
			AtomicInteger auxAtomic=aux3.getWaitingPeriod();
			int auxInt=auxAtomic.get();
			if(auxInt<mini) {
				mini=auxInt;
			}
		}
		for(Server aux3:servers) {
			AtomicInteger auxAtomic=aux3.getWaitingPeriod();
			int auxInt=auxAtomic.get();
			if(auxInt==mini) {
				aux3.addTask(t);
				break;
			}
		}
		
	}
	
}
