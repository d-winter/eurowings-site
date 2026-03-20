export const GET_HOMEPAGE = `
  query GetHomepage {
    homepages(first: 1, stage: PUBLISHED) {
      title
      slug
      seo { metaTitle metaDescription ogImage noIndex }
      heroBanner {
        heading
        subheading
        backgroundImage { url }
        cta { id label url variant openInNewTab }
      }
      promoCards {
        id heading description priceFrom currency linkUrl linkLabel
        image { url }
      }
      contentSections { heading body { html } imageUrl }
      legalNotes { id title identifier content { html } }
      featuredDestinations {
        id title slug startingPrice currency
        coverImage { url }
        airport { name iataCode }
      }
    }
  }
`;

export const GET_DESTINATION_PAGE = `
  query GetDestinationPage($slug: String!) {
    destinationPage(where: { slug: $slug }, stage: PUBLISHED) {
      title
      slug
      description { html }
      startingPrice
      currency
      seo { metaTitle metaDescription ogImage noIndex }
      coverImage { url }
      airport { name iataCode city country countryCode }
      highlights { id heading icon description }
      contentSections { heading body { html } imageUrl }
      flightOffers {
        id title originAirport destinationAirport
        priceFrom travelDate currency linkUrl
      }
      legalNotes { id title identifier content { html } }
      relatedDestinations {
        id title slug startingPrice currency
        coverImage { url }
        airport { name iataCode }
      }
    }
  }
`;

export const GET_ALL_DESTINATION_SLUGS = `
  query GetAllDestinationSlugs {
    destinationPages(stage: PUBLISHED, first: 100) {
      slug
    }
  }
`;

export const GET_ALL_DESTINATIONS = `
  query GetAllDestinations {
    destinationPages(stage: PUBLISHED, first: 50) {
      id title slug startingPrice currency
      coverImage { url }
      airport { name iataCode city country }
    }
  }
`;

export const GET_FAQ_PAGE = `
  query GetFaqPage {
    faqPages(first: 1, stage: PUBLISHED) {
      title description
      seo { metaTitle metaDescription }
    }
    faqCategories(stage: PUBLISHED) {
      id title slug description icon
      faqItems(orderBy: sortOrder_ASC) {
        id question answer { html } sortOrder
      }
    }
  }
`;

export const GET_LANDING_PAGE = `
  query GetLandingPage($slug: String!) {
    landingPage(where: { slug: $slug }, stage: PUBLISHED) {
      title
      slug
      seo { metaTitle metaDescription ogImage noIndex }
      heroBanner {
        heading
        subheading
        backgroundImage { url }
        cta { id label url variant openInNewTab }
      }
      contentSections { heading body { html } imageUrl }
      contentBlocks {
        ... on Promotion {
          __typename id heading description priceFrom currency linkUrl linkLabel
          image { url }
        }
        ... on FlightOffer {
          __typename id title originAirport destinationAirport
          priceFrom travelDate currency linkUrl
        }
        ... on CtaButton {
          __typename id label url variant openInNewTab
        }
        ... on DestinationPage {
          __typename id title slug startingPrice currency
          coverImage { url }
          airport { name iataCode }
        }
      }
      legalNotes { id title identifier content { html } }
    }
  }
`;

export const GET_ALL_LANDING_PAGE_SLUGS = `
  query GetAllLandingPageSlugs {
    landingPages(stage: PUBLISHED, first: 100) {
      slug
    }
  }
`;
