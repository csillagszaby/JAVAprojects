package BusinessLayer;

import java.util.ArrayList;
import java.util.List;

import PresentationLayer.Observer;

public abstract class Observable {
    private List<Observer> observers = new ArrayList<>();
 
    public void addObserver(Observer obs) {
        this.observers.add(obs);
    }
 
    public void removeObserver(Observer obs) {
        this.observers.remove(obs);
    }
 
    public void seter(Orderi ord,ArrayList<MenuItem> items) {
        for (Observer obs : this.observers) {
            obs.update(ord,items);
        }
    }
}
