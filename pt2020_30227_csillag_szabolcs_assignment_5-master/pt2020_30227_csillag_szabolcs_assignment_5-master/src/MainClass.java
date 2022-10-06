import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@SuppressWarnings("deprecation")
public class MainClass {
	private static ArrayList<MonitoredData> lista = new ArrayList<>();
	private static Map<String, Integer> mapi;
	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	private static SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
	private static SimpleDateFormat sdfday = new SimpleDateFormat("dd");

	public static void task1() throws IOException {
		Stream<String> rows = Files.lines(Paths.get("Activities.txt"));
		rows.map(x -> x.split("\t\t")).forEach(x -> {
			try {
				lista.add(new MonitoredData(sdf.parse(x[0]), sdf.parse(x[1]), x[2]));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		});
		rows.close();
		File task1 = new File("Task_1.txt");
		if (!task1.exists()) {
			task1.createNewFile();
		}
		PrintWriter pw = new PrintWriter(task1);
		for (MonitoredData aux : lista) {
			pw.println(aux);
		}
		pw.close();
	}

	public static void task2() throws IOException {
		int dayCount = (int) lista.stream().map(x -> sdf2.format(x.getStartTime())).distinct().count();
		File task2 = new File("Task_2.txt");
		if (!task2.exists()) {
			task2.createNewFile();
		}
		PrintWriter pw2 = new PrintWriter(task2);
		pw2.println(dayCount);
		pw2.close();
	}

	public static void task3() throws IOException {
		mapi = lista.stream().collect(Collectors.toMap(x -> x.getActivity(), x -> 1, (val1, val2) -> val1 + val2));
		File task3 = new File("Task_3.txt");
		if (!task3.exists()) {
			task3.createNewFile();
		}
		PrintWriter pw3 = new PrintWriter(task3);
		for (String key : mapi.keySet()) {
			pw3.println(mapi.get(key) + " " + key);
		}
		pw3.close();
	}

	public static void task4() throws IOException {
		List<Integer> days = new ArrayList<>();// lista cu zile diferite
		int actual = -1;
		for (MonitoredData aux : lista) {
			int aux_int = Integer.parseInt(sdfday.format(aux.getStartTime()));
			if (aux_int != actual) {
				actual = aux_int;
				days.add(actual);
			}
		}
		Map<Integer, Map<String, Integer>> map2 = days.stream().collect(Collectors.toMap(x -> x, x -> {
			return lista.stream()
					.filter(p -> Integer.parseInt(sdfday.format(p.getStartTime())) == x
							|| Integer.parseInt(sdfday.format(p.getEndTime())) == x)
					.collect(Collectors.toMap(p -> p.getActivity(), p -> 1, (val1, val2) -> val1 + val2));
		}));
		File task4 = new File("Task_4.txt");
		if (!task4.exists()) {
			task4.createNewFile();
		}
		PrintWriter pw4 = new PrintWriter(task4);
		for (int key : map2.keySet()) {
			pw4.println("key: " + key + "\n\t" + map2.get(key));
		}
		pw4.close();
	}

	public static void task5() throws IOException {
		Map<String, Integer> map3 = lista.stream().collect(Collectors.toMap(x -> x.getActivity(), x -> {
			int nr = 0;
			if (x.getEndTime().getHours() < x.getStartTime().getHours()) {
				nr = 24 * 3600;
			}
			return nr + (x.getEndTime().getHours() - x.getStartTime().getHours()) * 3600
					+ (x.getEndTime().getMinutes() - x.getStartTime().getMinutes()) * 60
					+ (x.getEndTime().getSeconds() - x.getStartTime().getSeconds());
		}, (val1, val2) -> val1 + val2));
		File task5 = new File("Task_5.txt");
		if (!task5.exists()) {
			task5.createNewFile();
		}
		PrintWriter pw5 = new PrintWriter(task5);
		for (String key : map3.keySet()) {
			pw5.println(map3.get(key) / (3600 * 24) + " day " + map3.get(key) % (3600 * 24) / 3600 + " hours "
					+ map3.get(key) % (3600) / 60 + " minutes " + map3.get(key) % (60) + " seconds , with activity: "
					+ key);
		}
		pw5.close();
	}

	public static void task6() throws IOException {
		List<String> listatask6 = new ArrayList<>();
		Map<String, Integer> map4 = lista.stream().collect(Collectors.toMap(x -> x.getActivity(), x -> {
			int ok = 0, nr = 0;
			if (x.getEndTime().getHours() < x.getStartTime().getHours()) {
				nr = 24 * 3600;
			}
			int durata = nr + (x.getEndTime().getHours() - x.getStartTime().getHours()) * 3600
					+ (x.getEndTime().getMinutes() - x.getStartTime().getMinutes()) * 60
					+ (x.getEndTime().getSeconds() - x.getStartTime().getSeconds());
			if (durata < 300) {
				ok = 1; // adica daca durata e mai mica de 5 min =5*60=300 secunde ,e bun
			}
			return ok;
		}, (val1, val2) -> val1 + val2));
		for (String key : mapi.keySet()) {
			if (mapi.get(key) * 90.0 / 100 < map4.get(key)) {
				listatask6.add(key);
			}
		}
		File task6 = new File("Task_6.txt");
		if (!task6.exists()) {
			task6.createNewFile();
		}
		PrintWriter pw6 = new PrintWriter(task6);
		for (String s1 : listatask6) {
			pw6.println(s1);
		}
		pw6.close();
	}

	public static void main(String[] args) throws IOException {
		task1();
		task2();
		task3();
		task4();
		task5();
		task6();
	}

}
