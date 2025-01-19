import type { Availability } from "@/types/Posts.ts";

export interface Restaurant {
    document_type: string
    content_type: string
    title: string
    about_us: string
    address: string
    geolocation: Geolocation
    phone: string
    has_gallery: boolean
    has_menu: boolean
    has_services: boolean
    cover: string
    logo: string
    subtitle: string
    call_to_action: CallToAction
    tag1?: string
    tag2?: string
    tag3?: string
    media: Media
    statics: Statics
    is_private: boolean
    availability: Availability
    show_areas: boolean
}

export interface Geolocation {
    type: string
    coordinates: number[]
}

export interface CallToAction {
    slug: string
    version: number
    slug_venue: string
    version_venue: number
    document_type: string
    content_type: string
    content_name: string
}

export interface Media {
    seo: Seo
    open_graph: OpenGraph
}

export interface Seo {
    title: string
    description: string
}

export interface OpenGraph {
    title: string
    description: string
}

export interface Statics {
    more_details: string
}
