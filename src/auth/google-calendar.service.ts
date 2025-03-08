import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class GoogleCalendarService {
  private calendar;

  constructor(private readonly googleAuthService: GoogleAuthService) {
    this.calendar = google.calendar({ version: 'v3' });
  }

  // TODD: Pass days
  async getCalendarEvents(accessToken: string, days: number): Promise<any[]> {
    try {
      const oauth2Client = this.googleAuthService.getClient();

      oauth2Client.setCredentials({ access_token: accessToken });
      const now = new Date();
      const daysAgo = new Date(now);
      daysAgo.setDate(now.getDate() - days);

      // List events from the user's primary calendar
      const response = await this.calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        timeMin: daysAgo.toISOString(),
        timeMax: now.toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items; // Array of calendar events
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // throw new Error(error);
    }
  }
}
