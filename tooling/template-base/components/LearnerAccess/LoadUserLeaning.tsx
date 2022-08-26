import React, { useEffect, useState } from 'react';
import listViewSelector from '../../renderer/listViewSelector.svg';
import gridNotSelected from '../../renderer/gridNotSelected.svg';
import gridSelected from '../../renderer/gridSelected.svg';

import { LoadedComponentProps } from '@thoughtindustries/learner-access/src/types';
import {
  useUserContentItemsQuery,
  useUserCourseCompletionProgressQuery,
  LoadingDots,
  hydrateContent,
  HydratedContentItem
} from '@thoughtindustries/content';
import { useTranslation } from 'react-i18next';
import LearnerAccessGridView from './GridView';
import LearnerAccessListDisplayDropDown from './ListDisplayDropDown';
import LearnerAccessDisplayListView from './DisplayListView';

const LoadUserLearning = ({ query, kind, sort }: LoadedComponentProps): JSX.Element => {
  const [gridViewActive, setGridActive] = useState(true);

  // update state to display grid only on mobile
  const handleResize = () => {
    if (window.innerWidth < 600) {
      setGridActive(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  const { data, loading, error } = useUserContentItemsQuery({
    variables: {
      query,
      kind,
      sort
    },
    fetchPolicy: 'network-only'
  });

  const { i18n } = useTranslation();

  interface ContentUiProps {
    item: HydratedContentItem;
    index?: number;
  }

  const DisplayListView = ({ item }: ContentUiProps) => {
    // const [listViewDropDown, setListViewDropDown] = useContext(false);

    // item link
    const hydratedItem = hydrateContent(i18n, item);
    const itemLink = hydratedItem.href;

    return (
      // list flex container
      <LearnerAccessDisplayListView item={item} itemData={data} />
    );
  };

  const ListDisplayDropDown = ({ item }: ContentUiProps) => {
    const { data } = useUserCourseCompletionProgressQuery({
      variables: {
        id: item.id
      }
    });

    return (
      // {/* list drop down */}
      <LearnerAccessListDisplayDropDown item={item} itemData={data} />
    );
  };

  const DisplayGridView = ({ item }: ContentUiProps) => {
    // item link
    const hydratedItem = hydrateContent(i18n, item);
    const itemLink = hydratedItem.href;

    return (
      // {/* course card */}
      <LearnerAccessGridView item={item} itemUrl={itemLink} />
    );
  };

  if (loading) return <LoadingDots />;

  if (error) return <>{error.message}</>;

  if (!data || !data.UserContentItems) return <></>;

  return (
    <>
      {/* grid/list toggle */}
      <div className="hidden sm:flex justify-end p-3">
        {/* list display button */}
        {gridViewActive ? (
          <button
            className="flex border rounded-l-md w-9 h-9 place-content-center items-center"
            onClick={() => setGridActive(false)}
          >
            <img src={listViewSelector} />
          </button>
        ) : (
          <button
            className="flex border rounded-l-md w-9 h-9 place-content-center items-center bg-blue-600"
            onClick={() => setGridActive(false)}
          >
            <img src={listViewSelector} />
          </button>
        )}
        {/* grid display button */}
        {gridViewActive ? (
          <button
            className="flex border rounded-r-md w-9 h-9 place-content-center items-center bg-blue-600"
            onClick={() => setGridActive(true)}
          >
            <img src={gridSelected} />
          </button>
        ) : (
          <button
            className="flex border rounded-r-md w-9 h-9 place-content-center items-center"
            onClick={() => setGridActive(true)}
          >
            <img src={gridNotSelected} />
          </button>
        )}
      </div>
      {gridViewActive ? (
        <div className="grid gap-5 self-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.UserContentItems.map(item => {
            const hydratedItem = hydrateContent(i18n, item);
            if (hydratedItem.isCompleted) {
              return null;
            }
            return <DisplayGridView key={item.id} item={hydratedItem} />;
          })}
        </div>
      ) : (
        // list flex container
        <div className="sm:flex flex-col w-full hidden">
          {/* title and progress */}
          <div className="flex flex-row bg-slate-50 px-6 py-3 rounded-t-md">
            <div className="text-sm font-semibold basis-8/12">Title</div>
            <div className="text-sm font-semibold basis-4/12">Progress</div>
          </div>
          {data.UserContentItems.map(item => {
            const hydratedItem = hydrateContent(i18n, item);
            if (hydratedItem.isCompleted) {
              return null;
            }
            return (
              <div key={item.id} className="odd:bg-slate-50 even:bg-white">
                <DisplayListView key={item.id} item={hydratedItem} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default LoadUserLearning;
