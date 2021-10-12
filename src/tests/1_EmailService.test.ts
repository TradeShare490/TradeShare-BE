import EmailService from "../db/service/email.service";
import { expect } from "chai";
import { MailOption } from "../utils/email";

describe("Email Service can", () => {
	let emailService: EmailService;
	it("be setup", () => {
		emailService = new EmailService();
		expect(emailService).not.equal(undefined);
	});

	it("validate input without recipient", () => {
		const noRecipientMailOption: MailOption = {
			to: "",
			subject: "Testing Email Service from TradeShare",
			html: "<h1>Testing Email Service from TradeShare</h1><p>That was easy!</p>",
		};
		const res = emailService.send(noRecipientMailOption);
		expect(res).to.be.false;
	});

	it("validate input without body", () => {
		const emptyBodyMailOption: MailOption = {
			to: process.env.TESTER_EMAIL || "tradeshare.test.ca@gmail.com",
			subject: "Testing Email Service from TradeShare",
		};
		const res = emailService.send(emptyBodyMailOption);
		expect(res).to.be.false;
	});

	it("send an email", () => {
		const mailOption: MailOption = {
			to: process.env.TESTER_EMAIL || "tradeshare.test.ca@gmail.com",
			subject: "Testing Email Service from TradeShare",
			html: "<h1>Testing Email Service from TradeShare</h1><p>That was easy!</p>",
		};
		const res = emailService.send(mailOption);
		expect(res).to.be.true;
	});
});
