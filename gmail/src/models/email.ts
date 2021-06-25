import { ErrorMessage } from "../models/error_message";

/**
 * Represent the current email open in the Gmail application.
 */
export class Email {
    messageId: string;
    subject: string;

    body: string;
    contactEmail: string;
    contactFullEmail: string;
    contactName: string;

    constructor(messageId: string = null) {
        if (messageId) {
            const userEmail = Session.getEffectiveUser().getEmail().toLowerCase();

            this.messageId = messageId;
            const message = GmailApp.getMessageById(this.messageId);
            this.subject = message.getSubject();

            this.body = message.getBody();

            const fromHeaders = message.getFrom();
            const sent = fromHeaders.toLowerCase().indexOf(userEmail) >= 0;
            this.contactFullEmail = sent ? message.getTo() : message.getFrom();
            [this.contactName, this.contactEmail] = this._emailSplitTuple(this.contactFullEmail);
        }
    }

    /**
     * Parse a full FROM header and return the name part and the email part.
     *
     * E.G.
     *     "BOB" <bob@example.com> => ["BOB", "bob@example.com"]
     *     bob@example.com         => ["bob@example.com", "bob@example.com"]
     *
     */
    _emailSplitTuple(fullEmail: string): [string, string] {
        const match = fullEmail.match(/(.*)\s*<(.*)>/);
        fullEmail = fullEmail.replace("<", "").replace(">", "");

        if (!match) {
            return [fullEmail, fullEmail];
        }

        const [_, name, email] = match;

        if (!name || !email) {
            return [fullEmail, fullEmail];
        }

        return [name.replace(/\"/g, ""), email];
    }

    /**
     * Unserialize the email object (reverse JSON.stringify).
     */
    static fromJson(values: any): Email {
        const email = new Email();

        email.messageId = values.messageId;
        email.subject = values.subject;

        email.body = values.body;
        email.contactEmail = values.contactEmail;
        email.contactFullEmail = values.contactFullEmail;
        email.contactName = values.contactName;

        return email;
    }

    /**
     * Return the list of the attachments in the email.
     * Done in a getter and not as a property because this object is serialized and
     * given to the event handler.
     *
     * Returns:
     *     - Null and "attachments_size_exceeded" error, if the total attachment size limit
     *       is exceeded so we do not keep big files in memory.
     *     - If no attachment, return an empty array and an empty error message.
     *     - Otherwise, the list of attachments base 64 encoded and an empty error message
     */
    getAttachments(): [string[][], ErrorMessage] {
        const message = GmailApp.getMessageById(this.messageId);
        const gmailAttachments = message.getAttachments();
        const attachments: string[][] = [];

        // The size limit of the POST request are 50 MB
        // So we limit the total attachment size to 40 MB
        const MAXIMUM_ATTACHMENTS_SIZE = 40 * 1024 * 1024;

        let totalAttachmentsSize = 0;

        for (const gmailAttachment of gmailAttachments) {
            const bytesSize = gmailAttachment.getSize();
            totalAttachmentsSize += bytesSize;
            if (totalAttachmentsSize > MAXIMUM_ATTACHMENTS_SIZE) {
                return [null, new ErrorMessage("attachments_size_exceeded")];
            }

            const name = gmailAttachment.getName();
            const content = Utilities.base64Encode(gmailAttachment.getBytes());

            attachments.push([name, content]);
        }

        return [attachments, new ErrorMessage(null)];
    }
}
