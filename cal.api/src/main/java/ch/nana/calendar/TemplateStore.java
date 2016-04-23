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
	
	public final static String TEMPLATE_TABLE = "template";

	public Key storeTemplate(EventTemplate template, User user) {
		Entity employee = new Entity(TEMPLATE_TABLE);
		
		Key id = template.getId();
		if( id != null ){
			try {
				employee = datastore.get(id);
			} catch (EntityNotFoundException e) {}
		}
		
		employee.setProperty("colorBackground", template.getColorBackground());
		employee.setProperty("colorForeground", template.getColorForeground());
		employee.setProperty("from_hour", template.getFrom_hour());
		employee.setProperty("from_min", template.getFrom_min());
		employee.setProperty("owner", user.getUserId());
		employee.setProperty("text", template.getText());
		employee.setProperty("title", template.getTitle());
		employee.setProperty("to_hour", template.getTo_hour());
		employee.setProperty("to_min", template.getTo_min());

		return datastore.put(employee);
	}

	public List<EventTemplate> getTemplates(User user) {
		List<EventTemplate> templates = new ArrayList<>();

		Filter userFilter = new FilterPredicate("owner", FilterOperator.EQUAL, user.getUserId());
		Query q = new Query(TEMPLATE_TABLE).setFilter(userFilter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);

		
		for (Entity result : pq.asIterable()) {
			
			templates.add(toTemplate(result));
		}

		return templates;
	}
	
	private EventTemplate toTemplate(Entity result){
		EventTemplate tmpl = new EventTemplate();
		tmpl.setId(result.getKey());
		tmpl.setColorBackground((String)result.getProperty("colorBackground"));
		tmpl.setColorForeground((String)result.getProperty("colorForeground"));
		tmpl.setFrom_hour(toShort(result.getProperty("from_hour")));
		tmpl.setFrom_min(toShort(result.getProperty("from_min")));
		tmpl.setText((String)result.getProperty("text"));
		tmpl.setTitle((String)result.getProperty("title"));
		tmpl.setTo_hour(toShort(result.getProperty("to_hour")));
		tmpl.setTo_min(toShort(result.getProperty("to_min")));
		return tmpl;
	}
	
	private Short toShort(Object longObj){
		return longObj == null ? null : ((Long)longObj).shortValue();
	}

	public EventTemplate getTemplate(User user, Key id) throws EntityNotFoundException {
		Entity entity = datastore.get(id);
		EventTemplate tmpl = toTemplate(entity);
		
		return tmpl;
	}
}
