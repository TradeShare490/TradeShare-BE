import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

/**
 * A template for the email input
 */
export interface MailOption {
	to: string;
	subject: string;
	html?: string;
	text?: string;
	cc?: string;
}

export class EmailSender {
	private transporter: Mail;
	private service: string;
	private email: string;
	private email_password: string;

	constructor() {
		// check .env variables
		if (
			process.env.SERVICE === undefined ||
			process.env.EMAIL === undefined ||
			process.env.EMAIL_PASSWORD === undefined
		) {
			console.log(
				"Will setup email sender with default setup, please provide env for custom configuration"
			);
		}

		// setup values
		this.service = process.env.SERVICE || "gmail";
		this.email = process.env.EMAIL || "tradeshare.ca@gmail.com";
		this.email_password = process.env.EMAIL_PASSWORD || "tradeshare123";

		// setup transporter
		this.transporter = nodemailer.createTransport({
			service: this.service,
			auth: {
				user: this.email,
				pass: this.email_password,
			},
		});
	}

	/**
	 * Fill the sender by our email
	 * @param originalMailOption
	 * @returns
	 */
	private fillMailOption(originalMailOption: MailOption): Mail.Options {
		let mailOption: Mail.Options = { ...originalMailOption };
		mailOption.from = this.email; // update sender
		return mailOption;
	}

	/**
	 * Validate the input
	 * @param mailOptions input
	 * @returns An object with {isValidate: Boolean, message: string}
	 */
	private validateMailOptions(mailOptions: MailOption): { isValidate: boolean; message: string } {
		let isValidate = true;
		let message = "";
		// check content
		if (mailOptions.html === undefined && mailOptions.text === undefined) {
			message = "No content to send, please fill the content with either text or html option";
			isValidate = false;
		}

		// check receipients
		else if (mailOptions.to === undefined || mailOptions.to === "") {
			message = "No recipients, please give at least one.";
			isValidate = false;
		}

		return { isValidate, message };
	}

	/**
	 * Send an email
	 * @param mailOptions
	 */
	send(mailOptions: MailOption) {
		// Validate the input
		const validateResult = this.validateMailOptions(mailOptions);
		if (!validateResult.isValidate) {
			throw new Error(validateResult.message);
		}

		// Fill sender
		const content = this.fillMailOption(mailOptions);

		// Send
		this.transporter.sendMail(content, (error, info) => {
			if (error) {
				console.log(error);
				throw new Error(error.message);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
	}
}
