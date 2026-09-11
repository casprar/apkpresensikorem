import * as XLSX from 'xlsx';
import { formatTimestampToJakarta, formatDate } from '../utils/date';

export function formatAttendanceForExport(records) {
  if (!Array.isArray(records) || records.length === 0) return [];
  return records.map(record => {
    const name = record.name || (record.Name && record.Name !== '-' ? record.Name : null) || 'Unknown';
    const className = record.class_name || (record.Class && record.Class !== '-' ? record.Class : null) || '-';
    const genderRaw = record.gender || record.Gender;
    const gender = (genderRaw === 'MALE' || genderRaw === 'Male') ? 'Male' : (genderRaw === 'FEMALE' || genderRaw === 'Female') ? 'Female' : '-';
    const sessionName = record.sessions?.name || (record.Session && record.Session !== '-' ? record.Session : null) || '-';
    const sessionDate = record.sessions?.date ? formatDate(record.sessions.date) : (record.Date && record.Date !== '-' ? record.Date : null) || '-';
    const timeVal = record.created_at ? formatTimestampToJakarta(record.created_at) : (record.Time && record.Time !== '-' ? record.Time : null) || '-';

    return {
      Name: name,
      Class: className,
      Gender: gender,
      Session: sessionName,
      Date: sessionDate,
      Time: timeVal
    };
  });
}

export function exportToExcel(data, filename) {
  const formattedData = formatAttendanceForExport(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(data, filename) {
  const formattedData = formatAttendanceForExport(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csvText = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
