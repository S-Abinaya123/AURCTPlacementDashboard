import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateICSFile = (interview) => {
  const startDate = new Date(interview.interviewDate);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  const formatICSDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "").split('.')[0] + "Z";
  };

  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const now = formatDate(new Date());
  const start = formatICSDate(startDate);
  const end = formatICSDate(endDate);

  const description = interview.description 
    ? interview.description.replace(/\n/g, '\\n')
    : `Placement interview with ${interview.companyName} for the role of ${interview.role}`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AURCT Placement Dashboard//Interview Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${interview._id}@aurctplacement.edu
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:Interview: ${interview.companyName} - ${interview.role}
DESCRIPTION:${description}
${interview.jobLink ? `URL:${interview.jobLink}` : ''}
LOCATION:Online/Off-campus
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: Interview tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

export const saveICSFile = async (interview) => {
  const icsContent = generateICSFile(interview);
  
  const uploadsDir = path.join(__dirname, "../../uploads/calendar");
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `interview_${interview._id}.ics`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, icsContent);
  
  // Return absolute path for nodemailer attachment
  return path.resolve(filePath);
};

