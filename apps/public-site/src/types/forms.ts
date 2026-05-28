export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  track: string;
  about?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
