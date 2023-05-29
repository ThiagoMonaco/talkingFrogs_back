export interface SendEmail {
    sendEmail: (params: SendEmail.Params) => Promise<SendEmail.Result>;
}

export namespace SendEmail {
    export type Params = {
        to: string;
        subject: string;
        text: string;
    }

    export type Result = void
}