/// Sanity CMS project configuration.
/// Replace SANITY_PROJECT_ID with your actual Sanity project ID.
/// The dataset is typically "production" unless you have configured a different one.
/// No authentication is required for public datasets.

export const SANITY_PROJECT_ID = "your-project-id";
export const SANITY_DATASET = "production";
export const SANITY_API_VERSION = "2024-01-01";

export const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
