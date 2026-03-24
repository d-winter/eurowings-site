export const GET_HOMEPAGE = `
  query GetHomepage($stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    homepages(first: 1, stage: $stage, locales: $locales) {
      id
      title
      slug
      seo { metaTitle metaDescription ogImage noIndex }
      heroBanner {
        id
        heading
        subheading
        backgroundImage { url }
        cta { id label url variant openInNewTab }
      }
      promoCards {
        id heading description priceFrom currency linkUrl linkLabel
        image { url }
      }
      belowSearchBlocks {
        ... on Service {
          __typename id title teaser iconKey linkUrl linkLabel sortOrder
          image { url }
        }
        ... on ContentBlock {
          __typename id title subheading imageSide panelStyle sortOrder
          image { url }
          cta { id label url variant openInNewTab }
        }
      }
      contentSections { id heading body { html } imageUrl }
      legalNotes { id title identifier content { html } }
      featuredDestinations {
        id title slug startingPrice currency
        coverImage { url }
        airport { id name iataCode }
      }
    }
  }
`;

export const GET_DESTINATION_PAGE = `
  query GetDestinationPage($slug: String!, $stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    destinationPage(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      title
      slug
      description { html }
      startingPrice
      currency
      seo { metaTitle metaDescription ogImage noIndex }
      coverImage { url }
      airport { id name iataCode city country countryCode }
      highlights { id heading icon description }
      contentSections { id heading body { html } imageUrl }
      flightOffers {
        id title originAirport destinationAirport
        priceFrom travelDate currency linkUrl
      }
      legalNotes { id title identifier content { html } }
      relatedDestinations {
        id title slug startingPrice currency
        coverImage { url }
        airport { id name iataCode }
      }
    }
  }
`;

export const GET_ALL_DESTINATION_SLUGS = `
  query GetAllDestinationSlugs {
    destinationPages(stage: PUBLISHED, first: 100, locales: [en]) {
      slug
    }
  }
`;

export const GET_ALL_DESTINATIONS = `
  query GetAllDestinations($stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    destinationPages(stage: $stage, first: 50, locales: $locales) {
      id title slug startingPrice currency
      coverImage { url }
      airport { id name iataCode city country }
    }
  }
`;

export const GET_FAQ_PAGE = `
  query GetFaqPage($stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    faqPages(first: 1, stage: $stage, locales: $locales) {
      id title description
      seo { metaTitle metaDescription }
      faqItems(orderBy: sortOrder_ASC) {
        id question answer { html } sortOrder
        category {
          id title slug description icon
        }
      }
    }
  }
`;

export const GET_LANDING_PAGE = `
  query GetLandingPage($slug: String!, $stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    landingPage(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      title
      slug
      seo { metaTitle metaDescription ogImage noIndex }
      heroBanner {
        id
        heading
        subheading
        backgroundImage { url }
        cta { id label url variant openInNewTab }
      }
      contentSections { id heading body { html } imageUrl }
      contentBlocks {
        ... on Promotion {
          __typename id heading description priceFrom currency linkUrl linkLabel
          image { url }
        }
        ... on FlightOffer {
          __typename id offerTitle: title originAirport destinationAirport
          priceFrom travelDate currency linkUrl
        }
        ... on CtaButton {
          __typename id label url variant openInNewTab
        }
        ... on DestinationPage {
          __typename id destTitle: title slug startingPrice currency
          coverImage { url }
          airport { id name iataCode }
        }
        ... on Service {
          __typename id title teaser iconKey linkUrl linkLabel sortOrder
          image { url }
        }
        ... on ContentBlock {
          __typename id title subheading imageSide panelStyle sortOrder
          image { url }
          cta { id label url variant openInNewTab }
        }
      }
      legalNotes { id title identifier content { html } }
    }
  }
`;

export const GET_ALL_LANDING_PAGE_SLUGS = `
  query GetAllLandingPageSlugs {
    landingPages(stage: PUBLISHED, first: 100, locales: [en]) {
      slug
    }
  }
`;

export const GET_ACTIVE_TOP_BANNER = `
  query GetActiveTopBanner($stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    topBanners(where: { isActive: true }, first: 1, stage: $stage, locales: $locales) {
      id
      title
      slug
      ctaLabel
    }
  }
`;

export const GET_ALL_TOP_BANNER_SLUGS = `
  query GetAllTopBannerSlugs {
    topBanners(stage: PUBLISHED, first: 50, locales: [en]) {
      slug
    }
  }
`;

export const GET_TOP_BANNER_COLLECTION = `
  query GetTopBannerCollection($slug: String!, $stage: Stage! = PUBLISHED, $locales: [Locale!]!) {
    topBanner(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      title
      slug
      ctaLabel
      isActive
      featuredDestinations {
        id
        title
        slug
        startingPrice
        currency
        coverImage { url }
        airport { id name iataCode city country }
      }
    }
  }
`;

export const GET_SEGMENTS = `
  query GetSegments($stage: Stage! = PUBLISHED) {
    segments(stage: $stage) {
      id
      name
    }
  }
`;

export const GET_DESTINATION_LANDING_PAGE = `
  query GetDestinationLandingPage($slug: String!, $stage: Stage! = PUBLISHED, $locales: [Locale!]!, $segmentId: ID, $origin: String!, $destination: String!) {
    destinationLandingPages(where: { slug: $slug }, stage: $stage, locales: $locales, first: 1) {
      id
      title
      slug
      heroHeading
      heroSubheading
      heroImage { url }
      description { html }
      contentSections { heading body { html } }
      seo { metaTitle metaDescription ogImage noIndex }
      cta { id label url variant openInNewTab }
      variants(where: { segments_some: { id: $segmentId } }, locales: $locales) {
        title
        heroHeading
        heroSubheading
        heroImage { url }
        description { html }
        contentSections { heading body { html } }
        cta { id label url variant openInNewTab }
      }
      flightOffers(origin: $origin, destination: $destination) {
        airline
        airlineCode
        flightNumber
        departureAirport
        departureTime
        arrivalAirport
        arrivalTime
        duration
        price
        currency
        date
      }
    }
  }
`;
