package ch.nana.calendar.entity;

import com.google.appengine.api.datastore.Key;

public class EventTemplate {


	private Key id;
	private String owner;
	private short from_hour;
	private short from_min;
	private short to_hour;
	private short to_min;

	private String text;
	private String title;
	private String colorBackground;
	private String colorForeground;
	
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Key getId() {
		return id;
	}
	public void setId(Key id) {
		this.id = id;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public short getFrom_hour() {
		return from_hour;
	}
	public void setFrom_hour(short from_hour) {
		this.from_hour = from_hour;
	}
	public short getFrom_min() {
		return from_min;
	}
	public void setFrom_min(short from_min) {
		this.from_min = from_min;
	}
	public short getTo_hour() {
		return to_hour;
	}
	public void setTo_hour(short to_hour) {
		this.to_hour = to_hour;
	}
	public short getTo_min() {
		return to_min;
	}
	public void setTo_min(short to_min) {
		this.to_min = to_min;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getColorBackground() {
		return colorBackground;
	}
	public void setColorBackground(String colorBackground) {
		this.colorBackground = colorBackground;
	}
	public String getColorForeground() {
		return colorForeground;
	}
	public void setColorForeground(String colorForeground) {
		this.colorForeground = colorForeground;
	}

}
