import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  hydrateContent,
  GlobalTypes,
  CatalogDocument,
  useCatalogQuery,
  ContentsDocument,
  useContentsQuery,
  UserRecentContentDocument,
  useUserRecentContentQuery,
  AddResourceToQueueDocument,
  useAddResourceToQueueMutation
} from '@thoughtindustries/content';
import {
  FeaturedContent,
  ContentTileStandardLayout,
  FeaturedContentContentItem,
  FeaturedContentHydratedContentItem
} from '../src';

export default {
  title: 'Example/FeaturedContent (data fetching)'
};

const headerOptions = {
  title: 'Feature Content Header'
};

const handleClick = (): void => {
  // do something
};

const mockCatalogQueryVariables = {
  query: 'test query',
  querySignature: 'test query signature',
  querySort: 'relevance'
};
const mockQueryContentsQueryVariables = {
  ids: ['item-id']
};
const mockUserRecentContentQueryVariables = {
  limit: 2
};
const mockContentItemFactory = (isLearningPath = false) => ({
  __typename: 'Content',
  id: 'item-id',
  asset:
    'https://d36ai2hkxl16us.cloudfront.net/thoughtindustries/image/upload/a_exif,c_fill,w_800/v1416438573/placeholder_kcjvxm.jpg',
  authors: ['Author A', 'Author B'],
  availabilityStatus: 'available',
  canAddToQueue: true,
  contentTypeLabel: 'Guide',
  courseGracePeriodEnded: false,
  coursePresold: false,
  courseStartDate: '2016-11-07T05:51:02.856Z',
  description: 'Test description',
  rating: 78,
  slug: 'test-course-slug',
  title: 'Test title',
  kind: isLearningPath ? GlobalTypes.ContentKind.LearningPath : null,
  currentUserUnmetCoursePrerequisites: [],
  currentUserUnmetLearningPathPrerequisites: [],
  priceInCents: null,
  suggestedRetailPriceInCents: null,
  source: null,
  ribbon: null,
  displayCourse: 'display-course-id',
  currentUserMayReschedule: false,
  hasChildren: false,
  hideCourseDescription: false,
  isActive: true,
  waitlistingEnabled: false,
  waitlistingTriggered: false
});
const mockApolloResults = {
  catalogQuery: {
    request: {
      query: CatalogDocument,
      variables: { ...mockCatalogQueryVariables }
    },
    result: {
      data: {
        CatalogQuery: {
          contentItems: [mockContentItemFactory()]
        }
      }
    }
  },
  queryContentsQuery: {
    request: {
      query: ContentsDocument,
      variables: { ...mockQueryContentsQueryVariables }
    },
    result: {
      data: {
        QueryContents: [mockContentItemFactory(true)]
      }
    }
  },
  addCourseToQueueMutation: {
    request: {
      query: AddResourceToQueueDocument,
      variables: { resourceId: 'display-course-id' }
    },
    result: {
      data: {
        AddResourceToQueue: true
      }
    }
  },
  addLearningPathToQueueMutation: {
    request: {
      query: AddResourceToQueueDocument,
      variables: {
        resourceId: 'test-course-slug',
        resourceType: GlobalTypes.ContentKind.LearningPath
      }
    },
    result: {
      data: {
        AddResourceToQueue: true
      }
    }
  },
  userRecentContentQuery: {
    request: {
      query: UserRecentContentDocument,
      variables: { ...mockUserRecentContentQueryVariables }
    },
    result: {
      data: {
        UserRecentContent: [mockContentItemFactory()]
      }
    }
  }
};

export const WithCatalogQuery = () => {
  const { i18n } = useTranslation();
  const [addResourceToQueue] = useAddResourceToQueueMutation();
  const handleAddedToQueue = (item: FeaturedContentContentItem): Promise<void> => {
    const { displayCourse } = item as FeaturedContentHydratedContentItem;
    return displayCourse
      ? addResourceToQueue({ variables: { resourceId: displayCourse } }).then()
      : Promise.resolve();
  };

  const { data, loading, error } = useCatalogQuery({
    variables: { ...mockCatalogQueryVariables }
  });
  let content;
  if (loading) {
    content = <p>Loading content</p>;
  }
  if (error) {
    content = <p>Error loading content</p>;
  }
  if (data?.CatalogQuery.contentItems) {
    content = data.CatalogQuery.contentItems.map((item, index) => {
      const hydratedItem = hydrateContent(i18n, item);
      return <ContentTileStandardLayout.Item key={`item-${index}`} {...hydratedItem} />;
    });
  }
  return (
    <FeaturedContent>
      <ContentTileStandardLayout
        headerOptions={headerOptions}
        desktopColumnCount={3}
        onAddedToQueue={handleAddedToQueue}
        onClick={handleClick}
      >
        {content}
      </ContentTileStandardLayout>
    </FeaturedContent>
  );
};
WithCatalogQuery.parameters = {
  apolloClient: {
    mocks: [mockApolloResults.catalogQuery, mockApolloResults.addCourseToQueueMutation]
  }
};

export const WithQueryContentsQuery = () => {
  const { i18n } = useTranslation();
  const [addResourceToQueue] = useAddResourceToQueueMutation();
  const handleAddedToQueue = (item: FeaturedContentContentItem): Promise<void> => {
    const { slug, kind } = item as FeaturedContentHydratedContentItem;
    return slug
      ? addResourceToQueue({
          variables: {
            resourceType: kind,
            resourceId: slug
          }
        }).then()
      : Promise.resolve();
  };

  const { data, loading, error } = useContentsQuery({
    variables: { ...mockQueryContentsQueryVariables }
  });
  let content;
  if (loading) {
    content = <p>Loading content</p>;
  }
  if (error) {
    content = <p>Error loading content</p>;
  }
  if (data) {
    content = data.QueryContents.map((item, index) => {
      const hydratedItem = hydrateContent(i18n, item);
      return <ContentTileStandardLayout.Item key={`item-${index}`} {...hydratedItem} />;
    });
  }
  return (
    <FeaturedContent>
      <ContentTileStandardLayout
        headerOptions={headerOptions}
        desktopColumnCount={3}
        onAddedToQueue={handleAddedToQueue}
        onClick={handleClick}
      >
        {content}
      </ContentTileStandardLayout>
    </FeaturedContent>
  );
};
WithQueryContentsQuery.parameters = {
  apolloClient: {
    mocks: [mockApolloResults.queryContentsQuery, mockApolloResults.addLearningPathToQueueMutation]
  }
};

export const WithUserRecentContentQuery = () => {
  const { i18n } = useTranslation();
  const { data, loading, error } = useUserRecentContentQuery({
    variables: { ...mockUserRecentContentQueryVariables }
  });
  const handleAddedToQueue = (): Promise<void> => {
    return Promise.resolve();
  };
  let content;
  if (loading) {
    content = <p>Loading content</p>;
  }
  if (error) {
    content = <p>Error loading content</p>;
  }
  if (data) {
    content = data.UserRecentContent.map((item, index) => {
      const hydratedItem = hydrateContent(i18n, item);
      return <ContentTileStandardLayout.Item key={`item-${index}`} {...hydratedItem} />;
    });
  }
  return (
    <FeaturedContent>
      <ContentTileStandardLayout
        headerOptions={headerOptions}
        desktopColumnCount={3}
        onAddedToQueue={handleAddedToQueue}
        onClick={handleClick}
      >
        {content}
      </ContentTileStandardLayout>
    </FeaturedContent>
  );
};
WithUserRecentContentQuery.parameters = {
  apolloClient: {
    mocks: [mockApolloResults.userRecentContentQuery]
  }
};
