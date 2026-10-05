// Generate a unique tracking ID based on application type and timestamp
export function generateTrackingId(type: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const year = new Date().getFullYear();
  
  // Determine prefix based on application type
  let prefix = 'APP';
  if (type === 'FYP Proposal') {
    prefix = 'FYP';
  } else if (type.includes('Cross-Department')) {
    prefix = 'CDR';
  } else if (type.includes('Leave')) {
    prefix = 'LVE';
  } else if (type.includes('Timetable')) {
    prefix = 'TTC';
  } else if (type.includes('Multi-Level')) {
    prefix = 'MLA';
  }
  
  // Format: PREFIX-YEAR-RANDOM
  return `${prefix}-${year}-${random}${timestamp.toString().slice(-3)}`;
}

// Store application in localStorage
export function storeApplication(trackingId: string, applicationData: any) {
  try {
    const applications = getStoredApplications();
    applications[trackingId] = {
      ...applicationData,
      id: trackingId,
      submittedDate: new Date().toISOString(),
    };
    localStorage.setItem('link-one-applications', JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Error storing application:', error);
    return false;
  }
}

// Retrieve all stored applications
export function getStoredApplications(): Record<string, any> {
  try {
    const stored = localStorage.getItem('link-one-applications');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving applications:', error);
    return {};
  }
}

// Get a specific application by tracking ID
export function getApplicationByTrackingId(trackingId: string) {
  const applications = getStoredApplications();
  return applications[trackingId] || null;
}

// Get all applications as an array
export function getAllApplicationsArray() {
  const applications = getStoredApplications();
  return Object.values(applications);
}
