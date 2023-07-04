export interface CheckEmailExists {
	checkEmailExists: (email: CheckEmailExists.Request) => Promise<CheckEmailExists.Result>
}

export namespace CheckEmailExists {
	export type Request = string
	export type Result = boolean
}