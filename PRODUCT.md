# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The general public and anyone interested in photography. Visitors browse in their own time rather than completing a conversion-oriented task. The portfolio should leave them feeling comfortable taking photos themselves.

## Product Purpose

DDWUMP is Dwight Sabado's public photography portfolio. It presents a curated scroll gallery of standout photographs and a more casual album archive for travel photographs and anything else under the sun. Success is a visitor spending time with the work and feeling photography is approachable.

## Positioning

The portfolio intentionally holds two complementary bodies of work: a considered selection of strong photographs in the gallery, and an informal, less precious album dump that preserves everyday and travel images.

## Operating Context

Visitors arrive to view an image-led landing experience, browse the gallery or albums, learn about the photographer's gear, and find the social links on the About page. Images are delivered from Cloudinary; local product photography supports the Gear page.

## Capabilities and Constraints

- Routes: landing, gallery, albums and album detail, gear, and about.
- The application is a React, Vite, and TypeScript web project, deployed through Vercel.
- Gallery images are Cloudinary-hosted; the existing navigation and page structure are product functionality to preserve unless a later request changes them.

## Brand Commitments

- The photographer identity is DDWUMP / Dwight Sabado.
- The About page's existing social links are the only confirmed external links to preserve.

## Evidence on Hand

- Curated gallery and casual album photo collections defined in `src/data/photos.ts`.
- Local gear assets in `src/assets/`.
- Existing About page social links.
- No client testimonials, commercial claims, pricing, licensing details, or inquiry path have been confirmed; future work must not invent them.

## Product Principles

1. Let the photographs, rather than conversion pressure, lead the experience.
2. Make photography feel welcoming and attainable to a broad public audience.
3. Keep the curated gallery and casual album archive meaningfully distinct.
4. Preserve a direct, lightweight path to the photographer's existing social presence.
