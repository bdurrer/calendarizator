package ch.nana.calendar;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
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

	private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	private static final Logger log = Logger.getLogger(TemplateStore.class.getName());

	
	public final static String TEMPLATE_TABLE = "template";

	public Key storeTemplate(EventTemplate template, User user) {
		Entity entity = new Entity(TEMPLATE_TABLE);
		log.fine("Trying to save Template with title " + template.getTitle());
		
		

		if( template.getId() != null ){
			Key templateKey = KeyFactory.createKey(TEMPLATE_TABLE, template.getId());
			try {
				entity = datastore.get(templateKey);
			} catch (EntityNotFoundException e) {}
		}
		
		entity.setProperty("colorBackground", template.getColorBackground());
		entity.setProperty("colorForeground", template.getColorForeground());
		entity.setProperty("from_hour", template.getFrom_hour());
		entity.setProperty("from_min", template.getFrom_min());
		entity.setProperty("owner", user.getUserId());
		entity.setProperty("text", template.getText());
		entity.setProperty("title", template.getTitle());
		entity.setProperty("to_hour", template.getTo_hour());
		entity.setProperty("to_min", template.getTo_min());
		entity.setProperty("color_id", template.getColorId());
		entity.setProperty("order_id", template.getOrderId());
		entity.setProperty("location", template.getLocation());

		return datastore.put(entity);
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
		tmpl.setId(result.getKey().getId());
		tmpl.setColorBackground((String)result.getProperty("colorBackground"));
		tmpl.setColorForeground((String)result.getProperty("colorForeground"));
		tmpl.setFrom_hour(toShort(result.getProperty("from_hour")));
		tmpl.setFrom_min(toShort(result.getProperty("from_min")));
		tmpl.setText((String)result.getProperty("text"));
		tmpl.setTitle((String)result.getProperty("title"));
		tmpl.setTo_hour(toShort(result.getProperty("to_hour")));
		tmpl.setTo_min(toShort(result.getProperty("to_min")));
		tmpl.setColorId((String)result.getProperty("color_id"));
		tmpl.setOrderId(toShort(result.getProperty("order_id")));
		tmpl.setLocation((String)result.getProperty("location"));
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
