import { Story } from '@storybook/react';
import {
  AddResourceToQueueDocument,
  CatalogContentDocument,
  CatalogContentQuery,
  GlobalTypes,
  LanguagesQueryDocument,
  useAddResourceToQueueMutation
} from '@thoughtindustries/content';
import React from 'react';
import { Catalog, CatalogProps, CatalogProvider, CatalogResultItem } from '../src';

export default {
  title: 'Example/Catalog',
  component: Catalog,
  argTypes: {
    title: {
      name: 'title',
      type: { name: 'string', required: true },
      description: 'Title that appears on the Header.',
      control: { type: 'text' }
    },
    alternateTitleDisplay: {
      name: 'alternateTitleDisplay',
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'Show alternate title display.',
      control: { type: 'boolean' }
    },
    onClick: { action: 'clicked' }
  }
};

type MockQueryProps = {
  displayType: GlobalTypes.ContentItemDisplayType;
};
const mockBundle = {
  id: 'uuid-bundle',
  name: 'test bundle',
  priceInCents: 100,
  annualPriceInCents: 1000,
  slug: 'test-bundle'
};
const mockAggregations = [
  {
    label: 'Label 1',
    buckets: [
      {
        value: 'Bucket 1',
        count: 10
      },
      {
        value: 'Bucket 2',
        count: 20
      }
    ]
  },
  {
    label: 'Label 2',
    buckets: [
      {
        value: 'Bucket 3',
        count: 20
      }
    ]
  },
  {
    label: 'Label 3',
    buckets: [
      {
        value: 'en',
        query: 'language:en',
        count: 30
      },
      {
        value: 'jp',
        query: 'language:jp',
        count: 40
      }
    ]
  }
];
const mockContentTypes = ['type 1', 'type 2'];
const mockContentItem = {
  asset:
    'https://d36ai2hkxl16us.cloudfront.net/thoughtindustries/image/upload/a_exif,c_fill,w_800/v1416438573/placeholder_kcjvxm.jpg',
  authors: ['Test Author'],
  availabilityStatus: '',
  canAddToQueue: true,
  contentTypeLabel: 'Course',
  courseEndDate: new Date(2020, 1, 1).toISOString(),
  courseGracePeriodEnded: false,
  coursePresold: false,
  courseStartDate: new Date(2020, 0, 1).toISOString(),
  currentUserMayReschedule: false,
  description: 'description',
  kind: GlobalTypes.ContentKind.Course,
  hasChildren: false,
  hideCourseDescription: false,
  id: 'uuid',
  isActive: true,
  isCompleted: true,
  location: {
    id: 'uuid-location',
    name: 'test location',
    address1: 'test address1',
    city: 'test city'
  },
  priceInCents: 6500,
  rating: 36,
  slug: 'test-content',
  source: 'Test source',
  suggestedRetailPriceInCents: 8000,
  timeZone: 'America/Los_Angeles',
  title: 'Test title',
  waitlistingEnabled: false,
  waitlistingTriggered: false,
  ribbon: {
    color: '#39ad39',
    contrastColor: '#fff',
    darkerColor: '#2c872c',
    label: 'Test ribbon',
    slug: 'test-ribbon'
  }
};
const mockContentItemFactory = (length: number) =>
  Array.from({ length }, () => ({ ...mockContentItem }));
const mockCatalogContentFactory = ({
  displayType
}: MockQueryProps): CatalogContentQuery['CatalogContent'] => ({
  contentItems: [...mockContentItemFactory(6)],
  meta: {
    displayBundle: mockBundle,
    tokenLabel: 'token label',
    total: 100,
    hasMore: true,
    isCurated: false,
    aggregations: mockAggregations,
    contentTypes: mockContentTypes,
    resultsDisplayType: displayType,
    selectedSort: 'displayDate:asc',
    sortUpdatedAtEnabled: true,
    sortCreatedAtEnabled: true,
    sortTitleEnabled: true,
    sortPublishDateEnabled: true,
    sortCourseStartDateEnabled: true,
    sortRelevanceEnabled: true,
    displayTypeListEnabled: true,
    displayTypeGridEnabled: true,
    displayTypeCalendarEnabled: true,
    displayStartDateEnabled: true,
    displayAuthorsEnabled: true,
    displayDescriptionOnCalendar: true,
    contentTypeFilterEnabled: true,
    queryCustomFields: '{}'
  }
});
const mockLanguages = [
  {
    label: 'English',
    code: 'en'
  }
];
const mockApolloResultsFactory = (props: MockQueryProps) => [
  {
    request: {
      query: CatalogContentDocument,
      variables: {
        page: 1,
        sort: undefined,
        resultsDisplayType: undefined,
        token: 'test-token',
        contentTypes: [],
        query: 'test search term',
        labels: [],
        values: [],
        layoutId: undefined,
        widgetId: undefined
      }
    },
    result: {
      data: {
        CatalogContent: mockCatalogContentFactory(props)
      }
    }
  },
  {
    request: {
      query: LanguagesQueryDocument
    },
    result: {
      data: {
        Languages: [...mockLanguages]
      }
    }
  },
  {
    request: {
      query: AddResourceToQueueDocument,
      variables: {
        resourceId: 'test-content',
        resourceType: GlobalTypes.ContentKind.Course
      }
    },
    result: {
      data: {
        AddResourceToQueue: true
      }
    },
    newData: () => ({
      data: {
        AddResourceToQueue: true
      }
    })
  }
];
const config = {
  parsedUrl: {
    pathname: '/catalog',
    searchString: '?token=test-token&query=test%20search%20term'
  }
};
// use the options to bypass mocking full payload of responses
const mockedApolloProviderOptions = {
  watchQuery: { fetchPolicy: 'no-cache' as const },
  query: { fetchPolicy: 'no-cache' as const }
};
const apolloBaseParams = {
  addTypename: false,
  defaultOptions: mockedApolloProviderOptions
};

type CatalogStoryArgs = Pick<CatalogProps, 'title' | 'alternateTitleDisplay' | 'onClick'>;

const Template: Story<CatalogStoryArgs> = ({ ...args }) => {
  const [addResourceToQueue] = useAddResourceToQueueMutation();
  const handleAddedToQueue = ({ slug, kind, displayCourse }: CatalogResultItem): Promise<void> => {
    const resourceId = displayCourse || slug;
    return resourceId
      ? addResourceToQueue({ variables: { resourceId, resourceType: kind } }).then()
      : Promise.resolve();
  };
  return (
    <CatalogProvider config={config}>
      <Catalog onAddedToQueue={handleAddedToQueue} {...args} />
    </CatalogProvider>
  );
};

export const List = Template.bind({});
List.parameters = {
  apolloClient: {
    ...apolloBaseParams,
    mocks: [...mockApolloResultsFactory({ displayType: GlobalTypes.ContentItemDisplayType.List })]
  }
};

export const Grid = Template.bind({});
Grid.parameters = {
  apolloClient: {
    ...apolloBaseParams,
    mocks: [...mockApolloResultsFactory({ displayType: GlobalTypes.ContentItemDisplayType.Grid })]
  }
};

export const Calendar = Template.bind({});
Calendar.parameters = {
  apolloClient: {
    ...apolloBaseParams,
    mocks: [
      ...mockApolloResultsFactory({ displayType: GlobalTypes.ContentItemDisplayType.Calendar })
    ]
  }
};
