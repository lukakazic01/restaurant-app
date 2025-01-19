export interface Posts {
    posts: Post[]
    total: number
}

export interface Post {
    post: SinglePostEntry
    availability: Availability
}

export interface SinglePostEntry {
    slug: string
    version: number
    venue_name: string
    page_slug: string
    score: number
    availability_search: number
}

export interface Availability {
    page: Page
    areas: Area[]
    recommended: Recommended[]
    method: string
    formattedRequest: FormattedRequest
    availability_id: string
}

export interface Page {
    title: string
    showLess: string
    showMore: string
    subtitle: string
    generalError: string
}

export interface Area {
    id: string
    icon: string
    name: string
    text: string
    options: Option[]
    score: number
}

export interface Option {
    time: string
    method: 'disabled' | 'seat'
    score: number
    text?: string
}

export interface Recommended {
    id: string
    time: string
    method: string
    text: string
}

export interface FormattedRequest {
    date: string
    mediumDate: string
    shortDate: string
    time: string
    size: string
    service: string
}
