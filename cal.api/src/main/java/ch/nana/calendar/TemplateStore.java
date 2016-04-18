package ch.nana.calendar;

import java.util.ArrayList;
import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
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

	public Key storeTemplate(EventTemplate template, User user) {
		Entity employee = new Entity("template");
		
		Key id = template.getId();
		if( id != null ){
			try {
				employee = datastore.get(id);
			} catch (EntityNotFoundException e) {}
		}		
		
		employee.setProperty("ColorBackground", template.getColorBackground());
		employee.setProperty("ColorForeground", template.getColorForeground());
		employee.setProperty("From_hour", template.getFrom_hour());
		employee.setProperty("From_min", template.getFrom_min());
		employee.setProperty("Owner", user.getUserId());
		employee.setProperty("Text", template.getText());
		employee.setProperty("Title", template.getTitle());
		employee.setProperty("To_hour", template.getTo_hour());
		employee.setProperty("To_min", template.getTo_min());

		return datastore.put(employee);
	}

	public List<EventTemplate> getTemplates(User user) {
		List<EventTemplate> templates = new ArrayList<>();

		Filter userFilter = new FilterPredicate("owner", FilterOperator.EQUAL, user.getUserId());
		Query q = new Query("Person").setFilter(userFilter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);

		
		for (Entity result : pq.asIterable()) {
			EventTemplate tmpl = new EventTemplate();
			tmpl.setColorBackground((String)result.getProperty("ColorBackground"));
			tmpl.setColorForeground((String)result.getProperty("ColorBackground"));
			tmpl.setFrom_hour((short)result.getProperty("ColorBackground"));
			tmpl.setFrom_min((short)result.getProperty("ColorBackground"));
			tmpl.setId((Key)result.getProperty("ColorBackground"));
			tmpl.setOwner((String)result.getProperty("ColorBackground"));
			tmpl.setText((String)result.getProperty("ColorBackground"));
			tmpl.setTitle((String)result.getProperty("ColorBackground"));
			tmpl.setTo_hour((short)result.getProperty("ColorBackground"));
			tmpl.setTo_min((short)result.getProperty("ColorBackground"));
			templates.add(tmpl);
		}

		return templates;
	}
}
