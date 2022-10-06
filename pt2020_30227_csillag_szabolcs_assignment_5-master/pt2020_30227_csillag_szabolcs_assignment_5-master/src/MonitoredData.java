import java.text.SimpleDateFormat;
import java.util.Date;

public class MonitoredData {
	private Date startTime;
	private Date endTime;
	private String activity;

	public Date getStartTime() {
		return startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public String getActivity() {
		return activity;
	}

	public MonitoredData(Date startTime, Date endTime, String activity) {
		this.startTime = startTime;
		this.endTime = endTime;
		this.activity = activity;
	}

	public String toString() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		return sdf.format(startTime) + "\t" + sdf.format(endTime) + "\t" + activity;
	}
}
