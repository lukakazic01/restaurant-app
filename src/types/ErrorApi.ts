export interface ErrorApi {
    response: Response
    request: Request
}

interface Response {
    errors: Error[]
    data: any
    status: number
    headers: Headers
}

interface Error {
    message: string
    locations: Location[]
    path: string[]
    extensions: Extensions
}

interface Location {
    line: number
    column: number
}

interface Extensions {
    code: string
    exception: Exception
}

interface Exception {
    stacktrace: string[]
}

interface Headers {}

interface Request {
    query: string
    variables: Variables
}

interface Variables {
    input: Input
}

interface Input {
    criteria: Criteria
    marketplace_id: string
    locale: string
    geocodes: string[]
}

interface Criteria {
    date: string
    time: string
    size: string
}
