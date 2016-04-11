package ch.nana.calendar.entity;

import com.google.appengine.api.datastore.Key;


public class EventTemplate {
	
    private Key id;
	private short from_hour;
	private short from_min;
	private short to_hour;
	private short to_min;
	
	private String text;
	private String colorBackground;
	private String colorForeground;
		
}
