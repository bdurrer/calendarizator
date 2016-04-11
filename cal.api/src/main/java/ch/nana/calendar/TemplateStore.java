package ch.nana.calendar;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.users.User;

import ch.nana.calendar.entity.EventTemplate;

/**
 * @see https://cloud.google.com/appengine/docs/java/datastore/entities
 */
public class TemplateStore {

	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

	public Key storeTemplate(EventTemplate template) {
		Entity employee = new Entity("Employee");
		employee.setProperty("firstName", "Antonio");
		employee.setProperty("lastName", "Salieri");

		Date hireDate = new Date();
		employee.setProperty("hireDate", hireDate);

		employee.setProperty("attendedHrTraining", true);

		return datastore.put(employee);
	}

	public List<EventTemplate> getTemplates(User user) {
		List<EventTemplate> templates = new ArrayList<>();

		Filter userFilter = new FilterPredicate("owner", FilterOperator.EQUAL, user.getUserId());
		Query q = new Query("Person").setFilter(userFilter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);

		for (Entity result : pq.asIterable()) {
			String firstName = (String) result.getProperty("firstName");
			String lastName = (String) result.getProperty("lastName");
		}

		return templates;
	}
}
