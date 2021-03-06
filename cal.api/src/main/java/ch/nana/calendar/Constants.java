package ch.nana.calendar;

/**
 * Contains the client IDs and scopes for allowed clients consuming your API.
 */
public class Constants {
	public static final String WEB_CLIENT_ID = "948709330298-230d1pmktbgcmcdd2urhml3qt23nff7i.apps.googleusercontent.com";
	public static final String ANDROID_CLIENT_ID = "replace this with your Android client ID";
	public static final String IOS_CLIENT_ID = "replace this with your iOS client ID";
	public static final String ANDROID_AUDIENCE = WEB_CLIENT_ID;

	public static final String EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";
	public static final String CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";
	
	public static final String APP_ENGINE_AUDIENCE = "calendarizator.appspot.com";
}
