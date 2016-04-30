package ch.nana.calendar.entity;

import com.google.appengine.api.datastore.Key;

public class EventTemplate {


	private Long id;
	private Short from_hour;
	private Short from_min;
	private Short to_hour;
	private Short to_min;

	private Short orderId;
	
	private String text;
	private String title;
	private String colorBackground;
	private String colorForeground;
	private String colorId;
	private String location;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Short getFrom_hour() {
		return from_hour;
	}
	public void setFrom_hour(Short from_hour) {
		this.from_hour = from_hour;
	}
	public Short getFrom_min() {
		return from_min;
	}
	public void setFrom_min(Short from_min) {
		this.from_min = from_min;
	}
	public Short getTo_hour() {
		return to_hour;
	}
	public void setTo_hour(Short to_hour) {
		this.to_hour = to_hour;
	}
	public Short getTo_min() {
		return to_min;
	}
	public void setTo_min(Short to_min) {
		this.to_min = to_min;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
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
	public String getColorId() {
		return colorId;
	}
	public void setColorId(String colorId) {
		this.colorId = colorId;
	}
	public Short getOrderId() {
		return orderId;
	}
	public void setOrderId(Short orderId) {
		this.orderId = orderId;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}	
}
