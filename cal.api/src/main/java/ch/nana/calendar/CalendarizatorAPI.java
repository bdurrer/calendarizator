package ch.nana.calendar;

import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;

import ch.nana.calendar.entity.EventTemplate;

/** An endpoint class we are exposing */
@Api(name = "calApi",
     version = "v1",
     scopes = {Constants.EMAIL_SCOPE, Constants.CALENDAR_SCOPE},
     clientIds = {Constants.WEB_CLIENT_ID, com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
     namespace = @ApiNamespace(ownerDomain = "calendarizator.appspot.com",
                                ownerName = "calendarizator.appspot.com"))
public class CalendarizatorAPI {
	
	private TemplateStore ts = new TemplateStore();
    
	@ApiMethod(name = "template.list") 
	public List<EventTemplate> getTemplates(User user){
		TemplateStore ts = new TemplateStore();
		 return ts.getTemplates(user);
	}
	
	@ApiMethod(name = "template.get") 
	public EventTemplate getTemplate(User user, Key id) throws EntityNotFoundException{
		TemplateStore ts = new TemplateStore();
		 return ts.getTemplate(user, id);
	}
	
	@ApiMethod(name = "template.save", httpMethod="POST") 
	public Key saveTempate(EventTemplate template, User user){
		return ts.storeTemplate(template, user);
	}

}
