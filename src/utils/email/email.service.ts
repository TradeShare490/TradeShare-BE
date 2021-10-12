import { EmailSender, MailOption } from "./email";

export default class EmailService {
	private emailSender: EmailSender;

	constructor() {
		this.emailSender = new EmailSender();
	}

	/**
	 * Send an email
	 * @param mailOptions
	 */
	send(mailOptions: MailOption): boolean {
		try {
			this.emailSender.send(mailOptions);
			return true;
		} catch (error: any) {
			console.error(error.message);
			return false;
		}
	}
}
