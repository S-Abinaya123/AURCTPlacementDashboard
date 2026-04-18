export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
}

export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const baseUrl = "https://www.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startTime)}/${formatDate(event.endTime)}`,
  });

  if (event.description) {
    params.append("details", event.description);
  }

  if (event.location) {
    params.append("location", event.location);
  }

  return `${baseUrl}?${params.toString()}`;
};

export const openGoogleCalendar = (event: CalendarEvent): void => {
  const url = generateGoogleCalendarUrl(event);
  window.open(url, "_blank");
};

export const createRoadmapTaskEvent = (
  taskTitle: string,
  companyName: string,
  role: string,
  taskIndex: number
): CalendarEvent => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + taskIndex * 7);
  startDate.setHours(9, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(10, 0, 0, 0);

  return {
    title: `${taskTitle} - ${companyName} ${role ? role : ""}`.trim(),
    description: `Complete this task as part of your ${companyName} placement preparation roadmap.`,
    startTime: startDate,
    endTime: endDate,
  };
};

export const createInterviewEvent = (
  companyName: string,
  role: string,
  interviewDate: Date,
  description?: string,
  location?: string
): CalendarEvent => {
  const startTime = new Date(interviewDate);
  const endTime = new Date(interviewDate);
  endTime.setHours(endTime.getHours() + 1);

  return {
    title: `Interview: ${companyName} - ${role}`,
    description: description || `Placement interview with ${companyName} for the role of ${role}`,
    location: location,
    startTime,
    endTime,
  };
};