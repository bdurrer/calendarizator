package ch.nana.calendar;

import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;

import ch.nana.calendar.entity.EventTemplate;

/** An endpoint class we are exposing */
@Api(name = "calApi",
     version = "v1",
     scopes = {Constants.EMAIL_SCOPE, Constants.CALENDAR_SCOPE},
     namespace = @ApiNamespace(ownerDomain = "calendarizator.appspot.com",
                                ownerName = "calendarizator.appspot.com"))
public class CalendarizatorAPI {
	
	private TemplateStore ts = new TemplateStore();
    
	@ApiMethod(name = "templates") 
	public List<EventTemplate> getTemplates(User user){
		TemplateStore ts = new TemplateStore();
		return ts.getTemplates(user);
	}
	
	@ApiMethod(name = "save", httpMethod="POST") 
	public Key saveTempate(EventTemplate template, User user){
		return ts.storeTemplate(template, user);
	}
	
/*    
	@Override
	public List<GwtCalendar> getCalendars() throws IOException {
		try {
			com.google.api.services.calendar.Calendar client = Utils.loadCalendarClient();
			com.google.api.services.calendar.Calendar.CalendarList.List listRequest = client.calendarList().list();
			listRequest.setFields("items(id,summary)");
			CalendarList feed = listRequest.execute();
			ArrayList<GwtCalendar> result = new ArrayList<GwtCalendar>();
			if (feed.getItems() != null) {
				for (CalendarListEntry entry : feed.getItems()) {
					result.add(new GwtCalendar(entry.getId(), entry.getSummary()));
				}
			}
			return result;
		} catch (IOException e) {
			throw Utils.wrappedIOException(e);
		}
	}

	@Override
	public void insert(GwtCalendar calendar, List<PlanItemType> workdays, String dateString) throws IOException {
		com.google.api.services.calendar.Calendar client = Utils.loadCalendarClient();
		
		LocalDateTime startDateTime;
		try {
			// UTC
			
			Date date = commDateFormat.parse(dateString);
			java.util.Calendar utcCal = new GregorianCalendar(utcTimeZone);
			utcCal.setTimeInMillis(date.getTime());
			startDateTime = new LocalDateTime(utcCal.get(Calendar.YEAR), utcCal.get(Calendar.MONTH)+1, utcCal.get(Calendar.DAY_OF_MONTH), 0, 0);
		} catch (ParseException e) {
			throw new IOException(e.getMessage());
		}
		
		
		for (PlanItemType type : workdays) {			
			for (PlanTermin termin : type.getTermine()) {
				
				Event event = createEvent(termin, startDateTime);
				Event createdEvent = client.events().insert(calendar.id, event).execute();
				System.out.println("created event with ID=" +  createdEvent.getId());
			}
			
			startDateTime = startDateTime.plusDays(1);
		}
	}
	
	private Event createEvent(PlanTermin termin, LocalDateTime referenceDay){
		
		
		LocalDateTime localStart = referenceDay.withTime(termin.from_hour, termin.from_min, 0, 0);
		LocalDateTime localEnd = referenceDay.withTime(termin.to_hour, termin.to_min, 0, 0);
		
		if( localEnd.isBefore(localStart) ){
			// nachtschicht überschreitet tagesgrenze
			localEnd = localEnd.plusDays(1);
		}
		
		Event event = new Event();
		event.setStart(getTime(localStart));
		event.setEnd(getTime(localEnd));
		event.setSummary(termin.text);
		event.setLocation("Kantonsspital Aarau");
		
		
		
		return event;
	}

	private EventDateTime getTime(LocalDateTime calendar) {
		org.joda.time.DateTime jodaDateTime = calendar.toDateTime(DateTimeZone.forID("Europe/Zurich"));
		Date date = jodaDateTime.toDate(); //.toLocalDateTime().toDateTime().toDate();
		
		DateTime dateTime = new DateTime(date,TimeZone.getTimeZone("UTC+1"));
		return new EventDateTime().setTimeZone("Europe/Zurich").setDateTime(dateTime);
	}
	
	public static Date convertJodaTimezone(LocalDateTime date, String srcTz, String destTz) {
		
		
		org.joda.time.DateTime srcDateTime = date.toDateTime(DateTimeZone.forID(srcTz));
		org.joda.time.DateTime dstDateTime = srcDateTime.withZone(DateTimeZone.forID(destTz));
	    return dstDateTime.toLocalDateTime().toDateTime().toDate();
	}

	@Override
	public List<PlanItemType> parse(String workdays) throws IOException {
		StringTokenizer tk = new StringTokenizer(workdays);
		List<String> l = new ArrayList<String>();
		while(tk.hasMoreTokens()){
			l.add(tk.nextToken());
		}
		
		String[] args = l.toArray(new String[]{});
		
		List<PlanItemType> planItems = new ArrayList<PlanItemType>();
		
		Map<String,PlanItemType> allTypes = new HashMap<String,PlanItemType>();
		allTypes.put("leer", PlanItemType.Frei);

		for (PlanItemType type : PlanItemType.values()) {
			allTypes.put(type.getPlanSign().toLowerCase(), type);
		}

		for(int i=4; i < args.length; i++ ){
			String val = args[i];
			PlanItemType planItemType = allTypes.get(val.toLowerCase());
			if( planItemType == null ){
				planItemType = PlanItemType.Frei;
				System.out.println("Der Wert '" + val + "' an Stelle " + (i-3) +" konnte nicht erkannt werden. Mögliche Werte sind: " + StringUtils.join(allTypes.keySet(),", ") );
			}else{
				System.out.println("Eintrag " + (i-3) + " ist " + planItemType.getPlanSign() + "(" + planItemType.name() + ")");
			}
			planItems.add(planItemType);
		}
		
		return planItems;
	}
*/    

}
