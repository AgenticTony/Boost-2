import { gql } from "urql";

export const GET_MATERIALS = gql`
  query GetMaterials {
    materials {
      id
      title
      description
      file {
        url
      }
      fileType
      size
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages {
    pages {
      id
      title
      slug
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      slug
      tagline
      description {
        html
      }
      image {
        url
      }
    }
  }
`;
