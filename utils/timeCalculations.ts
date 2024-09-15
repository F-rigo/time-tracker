import { TimeRecord } from '../screens/HomeScreen';

export const calculateExtraHours = (
  entry: string | null,
  lunchStart: string | null,
  lunchEnd: string | null,
  exit: string | null
): string => {
  if (!entry || !exit) return "N/A";

  const [entryHour, entryMinute] = entry.split(':').map(Number);
  const [exitHour, exitMinute] = exit.split(':').map(Number);

  const entryDate = new Date();
  entryDate.setHours(entryHour, entryMinute, 0);

  const exitDate = new Date();
  exitDate.setHours(exitHour, exitMinute, 0);

  let lunchDuration = 0;
  if (lunchStart && lunchEnd) {
    const [lunchStartHour, lunchStartMinute] = lunchStart.split(':').map(Number);
    const [lunchEndHour, lunchEndMinute] = lunchEnd.split(':').map(Number);

    const lunchStartDate = new Date();
    lunchStartDate.setHours(lunchStartHour, lunchStartMinute, 0);

    const lunchEndDate = new Date();
    lunchEndDate.setHours(lunchEndHour, lunchEndMinute, 0);

    lunchDuration = (lunchEndDate.getTime() - lunchStartDate.getTime()) / (1000 * 60 * 60);
  }

  const hoursWorked = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60) - lunchDuration;
  const regularHours = 8;

  const extraHours = hoursWorked > regularHours ? hoursWorked - regularHours : 0;
  const extraHoursInt = Math.floor(extraHours);
  const extraMinutes = Math.round((extraHours - extraHoursInt) * 60);

  return `${extraHoursInt}:${extraMinutes.toString().padStart(2, '0')}`;
};

export const calculateTotalExtraHours = (records: TimeRecord[]): string => {
  let totalExtraHours = 0;

  records.forEach(record => {
    const extraHoursString = calculateExtraHours(record.entry, record.lunchStart, record.lunchEnd, record.exit);
    if (extraHoursString !== 'N/A') {
      const [hours, minutes] = extraHoursString.split(':').map(Number);
      totalExtraHours += hours + minutes / 60;
    }
  });

  const totalHoursInt = Math.floor(totalExtraHours);
  const totalMinutes = Math.round((totalExtraHours - totalHoursInt) * 60);

  return `${totalHoursInt}:${totalMinutes.toString().padStart(2, '0')}`;
};
